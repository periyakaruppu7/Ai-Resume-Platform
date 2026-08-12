package com.platform.dto;

import java.util.List;

public record RagQueryResponse(
        String questionText,
        String answerText,
        List<SourceChunk> relevantSources,
        double confidenceScore
) {
    public record SourceChunk(
            String documentName,
            String textSnippet,
            double similarityScore
    ) {}
}
