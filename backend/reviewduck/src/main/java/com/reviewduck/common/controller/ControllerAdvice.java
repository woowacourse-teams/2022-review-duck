package com.reviewduck.common.controller;

import static com.reviewduck.common.util.Logging.*;

import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.UnsatisfiedServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.reviewduck.auth.exception.AuthorizationException;
import com.reviewduck.common.dto.ErrorResponse;
import com.reviewduck.common.exception.CustomException;
import com.reviewduck.common.exception.NotFoundException;

@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(CustomException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleCustomException(Exception e) {

        error(e.getMessage());

        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleParameter(MethodArgumentNotValidException e) {

        error(e.getMessage());

        StringBuilder message = new StringBuilder();

        for (FieldError error : e.getFieldErrors()) {
            message.append(error.getDefaultMessage()).append(" ");
        }

        return new ErrorResponse(message.toString());
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFoundException(Exception e) {

        error(e.getMessage());

        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler(AuthorizationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthorizationException(Exception e) {

        error(e.getMessage());

        return new ErrorResponse(e.getMessage());
    }

    @ExceptionHandler({
        HttpMessageNotReadableException.class,
        UnsatisfiedServletRequestParameterException.class,
        MissingServletRequestParameterException.class,
        ConstraintViolationException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleHttpMessageNotReadableException(Exception e) {

        error(e.getMessage());

        return new ErrorResponse("파라미터 정보가 올바르지 않습니다.");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception e) {

        error(e.getMessage());

        return new ErrorResponse("예상치 못한 오류가 발생하였습니다.");
    }
}
