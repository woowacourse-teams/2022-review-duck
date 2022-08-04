package com.reviewduck.common.util;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Logging {

    private static final SlackClient slackClient = new SlackClient();

    public static void error(String message) {
        log.error(message);
        slackClient.sendMessage(message);
    }

    public static void info(String uri, String method, String request) {
        log.info("uri={}, method = {}, request = {}",
            uri, method, request);
    }
}
