package com.platform.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.transformers.TransformersEmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringAiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }

    @Bean
    public TransformersEmbeddingModel embeddingModel() {
        return new TransformersEmbeddingModel();
    }

    @Bean
    public VectorStore vectorStore(TransformersEmbeddingModel embeddingModel) {
        return new SimpleVectorStore(embeddingModel);
    }
}
