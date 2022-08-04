package com.reviewduck.common.util;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PACKAGE)
public class SlackPayload {

    private final String text;

    public String getText() {
        return "[ERROR]: " + text;
    }
}
