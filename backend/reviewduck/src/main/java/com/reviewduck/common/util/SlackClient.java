package com.reviewduck.common.util;

import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

public class SlackClient {

    private static final String SLACK_URL = "https://hooks.slack.com/services/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";
    private final WebClient webClient = WebClient.create();

    public String sendMessage(String text) {
        return webClient.post()
            .uri(SLACK_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(new SlackPayload(text))
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}
