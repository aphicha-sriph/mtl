#!/usr/bin/env swift

import AppKit
import Foundation
import PDFKit
import Vision

struct OCRLine: Codable {
    let text: String
    let confidence: Float
    let x: Double
    let y: Double
    let width: Double
    let height: Double
}

struct OCRResult: Codable {
    let pdf: String
    let page: Int
    let languages: [String]
    let lines: [OCRLine]
    let text: String
}

func fail(_ message: String) -> Never {
    FileHandle.standardError.write(Data("\(message)\n".utf8))
    exit(1)
}

guard CommandLine.arguments.count == 3 else {
    fail("Usage: vision-ocr-pdf-page.swift <pdf-path> <1-based-page>")
}

let pdfPath = CommandLine.arguments[1]
guard let pageNumber = Int(CommandLine.arguments[2]), pageNumber > 0 else {
    fail("Page must be a positive integer")
}
guard let document = PDFDocument(url: URL(fileURLWithPath: pdfPath)) else {
    fail("Unable to open PDF: \(pdfPath)")
}
guard pageNumber <= document.pageCount, let page = document.page(at: pageNumber - 1) else {
    fail("Page \(pageNumber) is outside 1...\(document.pageCount)")
}

let bounds = page.bounds(for: .mediaBox)
let scale: CGFloat = 4.0
let pixelWidth = max(1, Int(ceil(bounds.width * scale)))
let pixelHeight = max(1, Int(ceil(bounds.height * scale)))
let colorSpace = CGColorSpaceCreateDeviceRGB()
guard let context = CGContext(
    data: nil,
    width: pixelWidth,
    height: pixelHeight,
    bitsPerComponent: 8,
    bytesPerRow: 0,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
) else {
    fail("Unable to create render context")
}

context.setFillColor(NSColor.white.cgColor)
context.fill(CGRect(x: 0, y: 0, width: pixelWidth, height: pixelHeight))
context.saveGState()
context.scaleBy(x: scale, y: scale)
page.draw(with: .mediaBox, to: context)
context.restoreGState()
guard let image = context.makeImage() else {
    fail("Unable to render PDF page")
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.revision = VNRecognizeTextRequestRevision3
let requestedLanguages = ["th-TH", "en-US"]
let supportedLanguages = (try? request.supportedRecognitionLanguages()) ?? []
let languages = requestedLanguages.filter(supportedLanguages.contains)
guard languages.contains("th-TH") else {
    fail("Vision accurate OCR does not report th-TH support; supported=\(supportedLanguages.joined(separator: ","))")
}
request.recognitionLanguages = languages
request.usesLanguageCorrection = true
request.minimumTextHeight = 0.004

let handler = VNImageRequestHandler(cgImage: image, options: [:])
do {
    try handler.perform([request])
} catch {
    fail("Vision OCR failed: \(error)")
}

let observations = (request.results ?? []).sorted { lhs, rhs in
    let verticalDifference = abs(lhs.boundingBox.maxY - rhs.boundingBox.maxY)
    if verticalDifference > 0.008 {
        return lhs.boundingBox.maxY > rhs.boundingBox.maxY
    }
    return lhs.boundingBox.minX < rhs.boundingBox.minX
}

let lines = observations.compactMap { observation -> OCRLine? in
    guard let candidate = observation.topCandidates(1).first else { return nil }
    let box = observation.boundingBox
    return OCRLine(
        text: candidate.string,
        confidence: candidate.confidence,
        x: box.minX,
        y: box.minY,
        width: box.width,
        height: box.height
    )
}

let result = OCRResult(
    pdf: pdfPath,
    page: pageNumber,
    languages: languages,
    lines: lines,
    text: lines.map(\.text).joined(separator: "\n")
)
let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
do {
    let data = try encoder.encode(result)
    FileHandle.standardOutput.write(data)
    FileHandle.standardOutput.write(Data("\n".utf8))
} catch {
    fail("Unable to encode OCR JSON: \(error)")
}
