package hr.ukic.nutrition.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExceptionResponse {
    private int status;
    private String message;
    private String details;
    private LocalDateTime timestamp;
}
