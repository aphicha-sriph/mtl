#!/usr/bin/env python3
"""LEGACY: Extract a snapshot from downloaded muangthai-agent product pages.

This source is a privately operated agent site, not the insurer's official
catalog. Do not use its output as the current product list or as the sole basis
for recommendations. The script is kept only for historical comparison.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import urljoin

from lxml import html


BASE_URL = "https://www.muangthai-agent.com"
SPACE_RE = re.compile(r"\s+")


def clean(value: str | None) -> str:
    return SPACE_RE.sub(" ", value or "").strip()


def unique(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        normalized = clean(value)
        if normalized and normalized not in seen:
            seen.add(normalized)
            result.append(normalized)
    return result


def first_text(document: html.HtmlElement, xpath: str) -> str:
    values = document.xpath(xpath)
    if not values:
        return ""
    value = values[0]
    return clean(value if isinstance(value, str) else value.text_content())


def meta_content(document: html.HtmlElement, name: str) -> str:
    values = document.xpath(
        f"//meta[@name='{name}']/@content | //meta[@property='{name}']/@content"
    )
    return clean(values[0]) if values else ""


def classify(categories: list[str], title: str) -> tuple[str, str]:
    haystack = " ".join(categories + [title]).lower()
    if any(token in haystack for token in ("บำนาญ", "retire")):
        return "life", "annuity"
    if any(token in haystack for token in ("ยูนิตลิง", "unit linked", "unit-linked")):
        return "life", "unit_linked"
    if any(token in haystack for token in ("สะสมทรัพย์", "ออมทรัพย์", "saving", "saver")):
        return "life", "endowment"
    if any(token in haystack for token in ("ตลอดชีพ", "legacy", "protection 99", "โพรเทคชั่น 99")):
        return "life", "whole_life"
    if any(token in haystack for token in ("ชั่วระยะเวลา", "term-life", "term life", "เทอม")):
        return "life", "term_life"
    if any(token in haystack for token in ("โรคร้าย", "มะเร็ง", "เบาหวาน", "critical", " ci ")):
        return "rider", "critical_illness"
    if any(token in haystack for token in ("อุบัติเหตุ", "accident", "pa ", "pa-")):
        return "rider", "accident"
    if any(token in haystack for token in ("สุขภาพ", "health", "opd", "care", "เหมาจ่าย", "คลอดบุตร")):
        return "rider", "health"
    return "unknown", "other"


def extract_fact_lines(blocks: list[str], keywords: tuple[str, ...], limit: int = 12) -> list[str]:
    matches = [line for line in blocks if any(keyword in line for keyword in keywords)]
    return unique(matches)[:limit]


def extract_index(path: Path | None) -> dict[str, dict[str, object]]:
    if path is None:
        return {}
    document = html.parse(str(path)).getroot()
    result: dict[str, dict[str, object]] = {}
    for item in document.xpath("//div[contains(concat(' ', normalize-space(@class), ' '), ' item ')]"):
        hrefs = item.xpath(".//a[contains(@href, '/product/')]/@href")
        if not hrefs:
            continue
        url = urljoin(BASE_URL, hrefs[0])
        result[url] = {
            "index_title": first_text(item, ".//h3[1]"),
            "index_intro": first_text(item, ".//*[contains(@class, 'productIntro')]//p[1]"),
            "index_badges": unique(
                [clean(node.text_content()) for node in item.xpath(".//*[contains(@class, 'badge')]")]
            ),
        }
    return result


def extract_product(
    path: Path,
    index: dict[str, dict[str, object]],
    include_full: bool,
) -> dict[str, object]:
    document = html.parse(str(path)).getroot()
    title = first_text(document, "(//h1[contains(@class, 'productName')])[1]")
    if not title:
        title = first_text(document, "//title")

    breadcrumbs = unique(
        [
            clean(node.text_content())
            for node in document.xpath("//ol[contains(@class, 'breadcrumb')]//li")
        ]
    )
    categories = breadcrumbs[2:-1] if len(breadcrumbs) >= 4 else []

    canonical = first_text(document, "//link[@rel='canonical']/@href")
    if not canonical:
        product_link = document.xpath("//ol[contains(@class, 'breadcrumb')]//li[last()]//a/@href")
        canonical = urljoin(BASE_URL, product_link[0]) if product_link else ""

    description_nodes = document.xpath("(//div[contains(@class, 'divProductDescription')])[1]")
    description_text = clean(description_nodes[0].text_content()) if description_nodes else ""
    blocks: list[str] = []
    if description_nodes:
        leaf_xpath = ".//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6 or self::p or self::li or self::th or self::td or self::summary]"
        blocks = unique([clean(node.text_content()) for node in description_nodes[0].xpath(leaf_xpath)])

    official_links = unique(
        [
            urljoin(canonical or BASE_URL, href)
            for href in document.xpath("//a/@href")
            if "muangthai.co.th" in href or href.lower().endswith(".pdf")
        ]
    )
    page_type, subtype = classify(categories, title)

    index_data = index.get(canonical, {})
    meta_description = meta_content(document, "description")
    intro = clean(str(index_data.get("index_intro", "")))
    supplemental_fact_lines = unique(
        [
            line
            for line in [intro, meta_description]
            if any(
                keyword in line
                for keyword in (
                    "อายุ",
                    "ชำระเบี้ย",
                    "ส่งเบี้ย",
                    "คุ้มครอง",
                    "ลดหย่อน",
                    "บำนาญ",
                    "เงินคืน",
                    "วงเงิน",
                    "ทุนประกัน",
                    "ไม่ต้องตรวจ",
                    "Deduct",
                    "Copay",
                )
            )
        ]
    )

    result: dict[str, object] = {
        "title": title,
        "slug": path.stem,
        "url": canonical,
        "page_type": page_type,
        "subtype": subtype,
        "category_hierarchy": categories,
        "index_intro": intro,
        "index_badges": index_data.get("index_badges", []),
        "meta_description": meta_description,
        "age_facts": extract_fact_lines(
            blocks + supplemental_fact_lines,
            ("อายุที่รับประกัน", "อายุรับประกัน", "รับทำตั้งแต่อายุ", "ทำได้ตั้งแต่อายุ", "อายุแรกเข้า"),
        ),
        "premium_term_facts": extract_fact_lines(
            blocks + supplemental_fact_lines,
            ("ชำระเบี้ย", "ระยะเวลาชำระ", "จ่ายเบี้ย", "ชำระครั้งเดียว"),
        ),
        "coverage_term_facts": extract_fact_lines(
            blocks + supplemental_fact_lines,
            ("ระยะเวลาคุ้มครอง", "คุ้มครองถึง", "คุ้มครองจนครบ", "ครบอายุ"),
        ),
        "tax_facts": extract_fact_lines(blocks + supplemental_fact_lines, ("ลดหย่อนภาษี", "ลดหย่อน", "สิทธิลดหย่อน", "ตามหลักเกณฑ์ของกรมสรรพากร")),
        "sum_insured_facts": extract_fact_lines(blocks + supplemental_fact_lines, ("ทุนประกัน", "จำนวนเงินเอาประกัน")),
        "eligibility_and_caveats": extract_fact_lines(
            blocks + supplemental_fact_lines,
            ("ไม่ต้องตรวจสุขภาพ", "ตอบคำถามสุขภาพ", "ระยะเวลารอคอย", "ความรับผิดส่วนแรก", "ร่วมจ่าย", "co-pay", "แนบ", "ข้อยกเว้น"),
        ),
        "evidence_lines": unique(
            supplemental_fact_lines
            + extract_fact_lines(
                blocks,
                (
                    "จุดเด่น",
                    "อายุ",
                    "ชำระเบี้ย",
                    "ส่งเบี้ย",
                    "คุ้มครอง",
                    "ลดหย่อน",
                    "บำนาญ",
                    "เงินคืน",
                    "วงเงิน",
                    "ทุนประกัน",
                    "ไม่ต้องตรวจ",
                    "ระยะเวลารอคอย",
                    "ความรับผิดส่วนแรก",
                    "ร่วมจ่าย",
                ),
                limit=24,
            )
        )[:24],
        "official_links_found_on_page": official_links,
    }
    if include_full:
        result["detail_blocks"] = blocks
        result["description_text"] = description_text
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("product_dir", type=Path)
    parser.add_argument("--category-html", type=Path)
    parser.add_argument("--checked-at", default="2026-09-30")
    parser.add_argument("--full", action="store_true")
    args = parser.parse_args()

    index = extract_index(args.category_html)
    products = [
        extract_product(path, index=index, include_full=args.full)
        for path in sorted(args.product_dir.glob("*.html"))
    ]
    products.sort(key=lambda product: (str(product["subtype"]), str(product["title"])))
    result = {
        "snapshot_date": args.checked_at,
        "source_index": "https://www.muangthai-agent.com/category/?sortby=number&show=list",
        "source_note": (
            "The supplied catalog is a website operated by a Muang Thai Life sales agent, "
            "not the insurer's corporate product catalog. Verify quotations, underwriting, "
            "tax treatment, exclusions, and current sale status against the insurer's latest "
            "policy documents before presenting a recommendation."
        ),
        "product_count": len(products),
        "products": products,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
