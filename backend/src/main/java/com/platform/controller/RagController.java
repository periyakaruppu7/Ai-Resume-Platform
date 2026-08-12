package com.platform.controller;

import com.platform.dto.*;
import com.platform.service.RagService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/rag")
public class RagController {

    private final RagService ragService;

    public RagController(RagService ragService) {
        this.ragService = ragService;
    }

    @PostMapping(value = "/documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RagDocumentResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        return ResponseEntity.ok(ragService.uploadAndIngestDocument(file, authentication.getName()));
    }

    @GetMapping("/documents")
    public ResponseEntity<List<RagDocumentResponse>> getUserDocuments(Authentication authentication) {
        return ResponseEntity.ok(ragService.getUserDocuments(authentication.getName()));
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long id,
            Authentication authentication
    ) {
        ragService.deleteDocument(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/query")
    public ResponseEntity<RagQueryResponse> queryContext(
            @Valid @RequestBody RagQueryRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(ragService.queryVectorContext(request, authentication.getName()));
    }
}
