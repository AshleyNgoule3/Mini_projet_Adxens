package com.adxens.gestionemployes.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.time.OffsetDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        OffsetDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        List<ValidationErrorDetail> errors
) {

    public static ApiError of(HttpStatus status, String message, String path) {
        return new ApiError(OffsetDateTime.now(), status.value(), status.getReasonPhrase(), message, path, null);
    }

    public static ApiError validation(HttpStatus status, String message, String path,
                                       List<ValidationErrorDetail> errors) {
        return new ApiError(OffsetDateTime.now(), status.value(), status.getReasonPhrase(), message, path, errors);
    }
}
