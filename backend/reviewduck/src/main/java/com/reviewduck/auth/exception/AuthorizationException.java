package com.reviewduck.auth.exception;

import com.reviewduck.common.exception.CustomException;

public class AuthorizationException extends CustomException {

    public AuthorizationException(String message) {
        super(message);
    }
}
