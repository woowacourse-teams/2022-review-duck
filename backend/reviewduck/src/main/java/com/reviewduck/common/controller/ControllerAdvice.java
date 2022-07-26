package com.reviewduck.common.controller;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.reviewduck.common.dto.ErrorResponse;
import com.reviewduck.common.exception.CustomException;
import com.reviewduck.common.exception.NotFoundException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class ControllerAdvice {

    @ExceptionHandler(CustomException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleCustomException(Exception e) {

        log.error(e.getMessage());

        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleParameter(MethodArgumentNotValidException e) {

        log.error(e.getMessage());

        StringBuilder message = new StringBuilder();

        for (FieldError error : e.getFieldErrors()) {
            message.append(error.getDefaultMessage()).append(" ");
        }

        return new ErrorResponse(message.toString());
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFoundException(Exception e) {

        log.error(e.getMessage());

        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception e) {

        log.error(e.getMessage());

        return new ErrorResponse("예상치 못한 오류가 발생하였습니다.");
    }
}
