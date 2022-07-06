package com.reviewduck.controller;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.reviewduck.dto.response.ErrorResponse;
import com.reviewduck.exception.CustomException;
import com.reviewduck.exception.NotFoundException;

@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(CustomException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleCustomException(Exception e) {
        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleParameter(MethodArgumentNotValidException e) {
        StringBuilder message = new StringBuilder();

        for (FieldError error : e.getFieldErrors()) {
            message.append(error.getDefaultMessage()).append(" ");
        }

        return new ErrorResponse(message.toString());
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFoundException(Exception e) {
        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException() {
        return new ErrorResponse("예상치 못한 오류가 발생하였습니다.");
    }
}
