#!/usr/bin/env swift

import AppKit
import CoreGraphics
import Foundation

struct Product {
    let filename: String
    let name: String
    let category: String
    let imagePath: String
    let source: String
    let summary: String
    let facts: [(String, String)]
    let highlights: [String]
    let suitable: String
    let caveats: [String]
}

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let outputDirectory = root.appendingPathComponent("output/pdf", isDirectory: true)
try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

let products = [
    Product(
        filename: "senior-hbpa-product-summary.pdf",
        name: "โครงการ เมืองไทย วัยเก๋า อุ่นใจหายห่วง (เพื่อผู้สูงอายุ)",
        category: "ชุดความคุ้มครองชีวิต อุบัติเหตุ และชดเชยสุขภาพวงเงินแน่นอน",
        imagePath: "public/images/plans/03-wai-kao-oonjai.png",
        source: "https://www.muangthai.co.th/th/whole-life-insurance/senior_hbpa",
        summary: "หน้าผลิตภัณฑ์ทางการระบุว่าไม่ตรวจสุขภาพและไม่ต้องตอบคำถามสุขภาพ รวมความคุ้มครองชีวิต อุบัติเหตุ และผลประโยชน์สุขภาพแบบวงเงินแน่นอน",
        facts: [
            ("อายุรับ", "50–75 ปี"),
            ("คุ้มครองชีวิต/ชดเชยสุขภาพ", "ถึงอายุ 90 ปี"),
            ("คุ้มครองอุบัติเหตุ", "ถึงอายุ 76 ปี")
        ],
        highlights: [
            "สมัครง่ายตามคุณสมบัติที่หน้าทางการระบุ โดยไม่ตรวจและไม่ตอบคำถามสุขภาพ",
            "รวมหลักประกันชีวิต ความคุ้มครองอุบัติเหตุ และเงินชดเชยสุขภาพไว้ในชุดเดียว",
            "หน้าทางการแสดงความคุ้มครองอุบัติเหตุสาธารณะสูงสุด 3 ล้านบาท และค่ารักษาจากอุบัติเหตุสูงสุด 25,000 บาทตามแผน"
        ],
        suitable: "ผู้สูงวัยที่ต้องการสมัครง่าย และอยากรวมชีวิต อุบัติเหตุ และเงินชดเชยสุขภาพแบบกำหนดวงเงินไว้ในชุดเดียว",
        caveats: [
            "ผลประโยชน์สุขภาพเป็นวงเงินแน่นอนตามตาราง ไม่ใช่ประกันสุขภาพเหมาจ่ายที่ชำระค่ารักษาทั้งหมดตามจริง",
            "วงเงิน เงื่อนไขการเคลม ข้อยกเว้น และผลประโยชน์แต่ละปีต้องยืนยันจากใบเสนอขายและกรมธรรม์ล่าสุด"
        ]
    ),
    Product(
        filename: "senior-waigao-product-summary.pdf",
        name: "โครงการ เมืองไทยวัยเก๋า คุ้มทั่วไทย (เพื่อผู้สูงอายุ)",
        category: "ชุดความคุ้มครองชีวิตและอุบัติเหตุ",
        imagePath: "public/images/plans/04-wai-kao-thailand.png",
        source: "https://www.muangthai.co.th/th/whole-life-insurance/senior-waigao",
        summary: "ชุดความคุ้มครองชีวิตและอุบัติเหตุสำหรับผู้สูงวัย มีค่ารักษาจากอุบัติเหตุและเงินชดเชยรายวันตามแผน",
        facts: [
            ("อายุรับ", "50–75 ปี"),
            ("คุ้มครองชีวิต", "ถึงอายุ 90 ปี"),
            ("คุ้มครองอุบัติเหตุ", "ถึงอายุ 76 ปี")
        ],
        highlights: [
            "รวมหลักประกันชีวิตและความคุ้มครองอุบัติเหตุสำหรับการใช้ชีวิตประจำวันและการเดินทาง",
            "หน้าทางการแสดงค่ารักษาจากอุบัติเหตุสูงสุด 25,000 บาทตามแผน",
            "มีเงินชดเชยรายวันจากอุบัติเหตุสูงสุด 365 วัน และผลประโยชน์ ICU เพิ่มตามแผน"
        ],
        suitable: "ผู้สูงวัยที่เน้นหลักประกันชีวิตและค่ารักษาหรือเงินชดเชยจากอุบัติเหตุ",
        caveats: [
            "ต้องอ่านตารางผลประโยชน์กรณีเสียชีวิตจากการเจ็บป่วยใน 2 ปีแรก และอายุสิ้นสุดของสัญญาเพิ่มเติมอย่างละเอียด",
            "วงเงินและเงื่อนไขต่างกันตามแผน โปรดยืนยันจากใบเสนอขายและกรมธรรม์ล่าสุดก่อนสมัคร"
        ]
    ),
    Product(
        filename: "sme-20-plus-product-summary.pdf",
        name: "เมืองไทย SME 20 plus",
        category: "ประกันกลุ่มสำหรับธุรกิจขนาดเล็กและขนาดกลาง",
        imagePath: "public/images/plans/38-sme-20-plus.png",
        source: "https://www.muangthai.co.th/th/group-insurance/sme-20-plus",
        summary: "ประกันกลุ่มสำหรับนายจ้างที่ต้องการจัดสวัสดิการชีวิต สุขภาพ และความคุ้มครองเสริมให้พนักงาน โดยใช้หลักเกณฑ์กลุ่มตามหน้าผลิตภัณฑ์ทางการ",
        facts: [
            ("อายุสมาชิก", "15–65 ปี"),
            ("ขนาดกลุ่ม", "พนักงาน 20–100 คน"),
            ("คุณสมบัติสำคัญ", "อยู่ในประกันสังคมและสมัครทั้งกลุ่ม")
        ],
        highlights: [
            "ช่วยวางโครงสร้างสวัสดิการพนักงานในรูปแบบประกันกลุ่ม",
            "พิจารณาความคุ้มครองชีวิต สุขภาพ และความคุ้มครองเสริมตามแบบที่บริษัทเสนอได้",
            "ออกแบบมาสำหรับกลุ่มพนักงานขนาด 20–100 คนตามข้อมูลหน้าผลิตภัณฑ์"
        ],
        suitable: "SME ที่ต้องการยกระดับสวัสดิการ และดูแลความเสี่ยงด้านชีวิตหรือสุขภาพของพนักงานอย่างเป็นระบบ",
        caveats: [
            "พนักงานทุกคนต้องมีคุณสมบัติและเข้าร่วมตามเกณฑ์ที่กำหนด รวมถึงเงื่อนไขประกันสังคมตามหน้าทางการ",
            "แผน วงเงิน เบี้ย และเงื่อนไขรับประกันขึ้นกับข้อมูลกลุ่มจริง ต้องขอข้อเสนอเฉพาะกลุ่มก่อนตัดสินใจ"
        ]
    )
]

let pageSize = CGSize(width: 595.28, height: 841.89)
let margin: CGFloat = 56.7
let contentWidth = pageSize.width - (margin * 2)
let magenta = NSColor(srgbRed: 230 / 255, green: 0, blue: 109 / 255, alpha: 1)
let ink = NSColor(srgbRed: 9 / 255, green: 10 / 255, blue: 12 / 255, alpha: 1)
let secondary = NSColor(srgbRed: 66 / 255, green: 73 / 255, blue: 86 / 255, alpha: 1)
let muted = NSColor(srgbRed: 110 / 255, green: 117 / 255, blue: 128 / 255, alpha: 1)
let lineColor = NSColor(srgbRed: 228 / 255, green: 231 / 255, blue: 235 / 255, alpha: 1)
let softPink = NSColor(srgbRed: 1, green: 241 / 255, blue: 247 / 255, alpha: 1)

func thaiFont(size: CGFloat, bold: Bool = false) -> NSFont {
    NSFont(name: bold ? "Thonburi-Bold" : "Thonburi", size: size)
        ?? NSFont.systemFont(ofSize: size, weight: bold ? .semibold : .regular)
}

func textAttributes(size: CGFloat, color: NSColor, bold: Bool = false,
                    lineHeight: CGFloat? = nil, alignment: NSTextAlignment = .left) -> [NSAttributedString.Key: Any] {
    let style = NSMutableParagraphStyle()
    style.alignment = alignment
    style.lineBreakMode = .byWordWrapping
    if let lineHeight {
        style.minimumLineHeight = lineHeight
        style.maximumLineHeight = lineHeight
    }
    return [
        .font: thaiFont(size: size, bold: bold),
        .foregroundColor: color,
        .paragraphStyle: style,
        .kern: 0
    ]
}

@discardableResult
func drawText(_ text: String, x: CGFloat, y: CGFloat, width: CGFloat,
              size: CGFloat, color: NSColor = secondary, bold: Bool = false,
              lineHeight: CGFloat? = nil, alignment: NSTextAlignment = .left,
              maxHeight: CGFloat = 1_000) -> CGFloat {
    let attributed = NSAttributedString(
        string: text,
        attributes: textAttributes(size: size, color: color, bold: bold, lineHeight: lineHeight, alignment: alignment)
    )
    let measured = attributed.boundingRect(
        with: CGSize(width: width, height: maxHeight),
        options: [.usesLineFragmentOrigin, .usesFontLeading]
    )
    let height = min(ceil(measured.height) + 1, maxHeight)
    attributed.draw(
        with: CGRect(x: x, y: y, width: width, height: height),
        options: [.usesLineFragmentOrigin, .usesFontLeading]
    )
    return height
}

func drawPageChrome(pageNumber: Int) {
    magenta.setFill()
    CGRect(x: margin, y: 13, width: contentWidth, height: 4).fill()

    lineColor.setStroke()
    let footerLine = NSBezierPath()
    footerLine.lineWidth = 0.65
    footerLine.move(to: CGPoint(x: margin, y: 805))
    footerLine.line(to: CGPoint(x: pageSize.width - margin, y: 805))
    footerLine.stroke()

    _ = drawText(
        "LOCAL PRODUCT EXPLORER · ข้อมูลตรวจล่าสุด 30 กันยายน 2569",
        x: margin, y: 813, width: 385, size: 8.2, color: muted, lineHeight: 11
    )
    _ = drawText("หน้า \(pageNumber)", x: pageSize.width - margin - 70, y: 813, width: 70,
                 size: 8.2, color: muted, lineHeight: 11, alignment: .right)
}

func drawRoundedImage(path: URL, rect: CGRect) throws {
    guard let image = NSImage(contentsOf: path) else {
        throw NSError(domain: "ProductPDF", code: 2, userInfo: [NSLocalizedDescriptionKey: "Cannot load image: \(path.path)"])
    }
    let sourceSize = image.size
    let scale = max(rect.width / sourceSize.width, rect.height / sourceSize.height)
    let destination = CGRect(
        x: rect.midX - (sourceSize.width * scale / 2),
        y: rect.midY - (sourceSize.height * scale / 2),
        width: sourceSize.width * scale,
        height: sourceSize.height * scale
    )
    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(roundedRect: rect, xRadius: 7, yRadius: 7).addClip()
    image.draw(in: destination, from: .zero, operation: .sourceOver, fraction: 1, respectFlipped: true,
               hints: [.interpolation: NSImageInterpolation.high])
    NSGraphicsContext.restoreGraphicsState()
}

func drawFactTable(_ facts: [(String, String)], y: CGFloat) {
    let rowHeight: CGFloat = 34
    let labelWidth: CGFloat = 165
    for (index, fact) in facts.enumerated() {
        let rowY = y + CGFloat(index) * rowHeight
        softPink.setFill()
        CGRect(x: margin, y: rowY, width: labelWidth, height: rowHeight).fill()
        NSColor.white.setFill()
        CGRect(x: margin + labelWidth, y: rowY, width: contentWidth - labelWidth, height: rowHeight).fill()

        lineColor.setStroke()
        let border = NSBezierPath(rect: CGRect(x: margin, y: rowY, width: contentWidth, height: rowHeight))
        border.lineWidth = 0.7
        border.stroke()
        let divider = NSBezierPath()
        divider.lineWidth = 0.7
        divider.move(to: CGPoint(x: margin + labelWidth, y: rowY))
        divider.line(to: CGPoint(x: margin + labelWidth, y: rowY + rowHeight))
        divider.stroke()

        let labelHeight = drawText(fact.0, x: margin + 10, y: rowY + 7, width: labelWidth - 20,
                                   size: 9.2, color: muted, lineHeight: 13, maxHeight: 26)
        let valueHeight = drawText(fact.1, x: margin + labelWidth + 12, y: rowY + 6,
                                   width: contentWidth - labelWidth - 24, size: 10.8,
                                   color: secondary, bold: true, lineHeight: 15, maxHeight: 27)
        _ = (labelHeight, valueHeight)
    }
}

@discardableResult
func drawBullet(_ text: String, y: CGFloat) -> CGFloat {
    _ = drawText("•", x: margin + 3, y: y, width: 14, size: 12, color: secondary, bold: true, lineHeight: 17)
    let height = drawText(text, x: margin + 22, y: y, width: contentWidth - 22,
                          size: 10.8, color: secondary, lineHeight: 16.5)
    return max(height, 17)
}

func renderProduct(_ product: Product) throws {
    let outputURL = outputDirectory.appendingPathComponent(product.filename)
    guard let consumer = CGDataConsumer(url: outputURL as CFURL) else {
        throw NSError(domain: "ProductPDF", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot create PDF consumer"])
    }
    var mediaBox = CGRect(origin: .zero, size: pageSize)
    let metadata: [CFString: Any] = [
        kCGPDFContextTitle: product.name,
        kCGPDFContextAuthor: "Local Product Explorer",
        kCGPDFContextSubject: "สรุปข้อมูลผลิตภัณฑ์จากแหล่งทางการ"
    ]
    guard let context = CGContext(consumer: consumer, mediaBox: &mediaBox, metadata as CFDictionary) else {
        throw NSError(domain: "ProductPDF", code: 3, userInfo: [NSLocalizedDescriptionKey: "Cannot create PDF context"])
    }

    func beginPage(_ pageNumber: Int) {
        context.beginPDFPage(nil)
        context.saveGState()
        context.translateBy(x: 0, y: pageSize.height)
        context.scaleBy(x: 1, y: -1)
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: true)
        NSColor.white.setFill()
        CGRect(origin: .zero, size: pageSize).fill()
        drawPageChrome(pageNumber: pageNumber)
    }

    func endPage() {
        NSGraphicsContext.restoreGraphicsState()
        context.restoreGState()
        context.endPDFPage()
    }

    beginPage(1)
    var y: CGFloat = 48
    y += drawText("สรุปข้อมูลจากหน้าผลิตภัณฑ์ทางการ · ไม่ใช่โบรชัวร์ของบริษัท",
                  x: margin, y: y, width: contentWidth, size: 9.3, color: magenta, bold: true, lineHeight: 13) + 5
    y += drawText(product.name, x: margin, y: y, width: contentWidth,
                  size: 23, color: ink, bold: true, lineHeight: 30) + 5
    y += drawText(product.category, x: margin, y: y, width: contentWidth,
                  size: 13, color: secondary, lineHeight: 19) + 10

    let imageRect = CGRect(x: margin, y: y, width: contentWidth, height: 286)
    try drawRoundedImage(path: root.appendingPathComponent(product.imagePath), rect: imageRect)
    y = imageRect.maxY + 12
    y += drawText(product.summary, x: margin, y: y, width: contentWidth,
                  size: 11.7, color: secondary, lineHeight: 18) + 10
    drawFactTable(product.facts, y: y)
    endPage()

    beginPage(2)
    y = 48
    y += drawText("อ่านให้ชัดก่อนตัดสินใจ", x: margin, y: y, width: contentWidth,
                  size: 9.3, color: magenta, bold: true, lineHeight: 13) + 5
    y += drawText(product.name, x: margin, y: y, width: contentWidth,
                  size: 21.5, color: ink, bold: true, lineHeight: 28) + 9

    y += drawText("จุดเด่นที่ควรรู้", x: margin, y: y, width: contentWidth,
                  size: 16.5, color: ink, bold: true, lineHeight: 22) + 6
    for item in product.highlights {
        y += drawBullet(item, y: y) + 6
    }

    y += 5
    y += drawText("เหมาะกับใคร", x: margin, y: y, width: contentWidth,
                  size: 16.5, color: ink, bold: true, lineHeight: 22) + 5
    y += drawText(product.suitable, x: margin, y: y, width: contentWidth,
                  size: 10.8, color: secondary, lineHeight: 16.5) + 10

    y += drawText("ข้อควรพิจารณา", x: margin, y: y, width: contentWidth,
                  size: 16.5, color: ink, bold: true, lineHeight: 22) + 6
    for item in product.caveats {
        y += drawBullet(item, y: y) + 6
    }

    y += 8
    let statusText = "สถานะเอกสาร\nไม่พบโบรชัวร์ PDF บนหน้าผลิตภัณฑ์ทางการ ณ วันที่ตรวจสอบ เอกสารนี้จึงเป็นสรุปที่เว็บไซต์โลคอลจัดทำจากข้อมูลสาธารณะ ไม่ใช่เอกสารอนุมัติการขาย ใบเสนอขาย หรือกรมธรรม์ของบริษัท"
    let statusAttributed = NSAttributedString(
        string: statusText,
        attributes: textAttributes(size: 9.1, color: muted, lineHeight: 14)
    )
    let statusMeasured = statusAttributed.boundingRect(
        with: CGSize(width: contentWidth - 24, height: 120),
        options: [.usesLineFragmentOrigin, .usesFontLeading]
    )
    let statusHeight = ceil(statusMeasured.height) + 22
    softPink.setFill()
    NSBezierPath(roundedRect: CGRect(x: margin, y: y, width: contentWidth, height: statusHeight), xRadius: 6, yRadius: 6).fill()
    magenta.setStroke()
    let statusBorder = NSBezierPath(roundedRect: CGRect(x: margin, y: y, width: contentWidth, height: statusHeight), xRadius: 6, yRadius: 6)
    statusBorder.lineWidth = 0.8
    statusBorder.stroke()
    statusAttributed.draw(with: CGRect(x: margin + 12, y: y + 10, width: contentWidth - 24, height: statusHeight - 20),
                          options: [.usesLineFragmentOrigin, .usesFontLeading])
    y += statusHeight + 10

    y += drawText("แหล่งข้อมูลทางการ", x: margin, y: y, width: contentWidth,
                  size: 14.5, color: ink, bold: true, lineHeight: 20) + 3
    let urlY = y
    y += drawText(product.source, x: margin, y: y, width: contentWidth,
                  size: 9.2, color: magenta, lineHeight: 14) + 7
    let linkRect = CGRect(x: margin, y: pageSize.height - urlY - 18, width: contentWidth, height: 20)
    context.setURL(URL(string: product.source)! as CFURL, for: linkRect)
    _ = drawText(
        "โปรดตรวจใบเสนอขาย ตารางผลประโยชน์ เงื่อนไขกรมธรรม์ ข้อยกเว้น และสถานะการเสนอขายล่าสุดกับบริษัทหรือผู้แนะนำที่ได้รับอนุญาตก่อนตัดสินใจทุกครั้ง",
        x: margin, y: y, width: contentWidth, size: 8.9, color: muted, lineHeight: 14
    )
    endPage()
    context.closePDF()
    print(outputURL.path)
}

for product in products {
    try renderProduct(product)
}
