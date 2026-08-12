package com.platform.service;

import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class PdfParsingService {

    private static final Logger log = LoggerFactory.getLogger(PdfParsingService.class);

    private final Tika tika = new Tika();

    public String extractText(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            String text = tika.parseToString(inputStream);
            if (text == null || text.isBlank()) {
                log.warn("Extracted text from PDF is empty or null for file: {}", file.getOriginalFilename());
                return "";
            }
            return text.trim();
        } catch (Exception e) {
            log.error("Failed to parse document text with Apache Tika: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to extract text from file: " + file.getOriginalFilename(), e);
        }
    }
}
