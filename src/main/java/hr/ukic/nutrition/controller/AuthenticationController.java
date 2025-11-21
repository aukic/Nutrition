package hr.ukic.nutrition.controller;

import hr.ukic.nutrition.dto.AuthenticationResponse;
import hr.ukic.nutrition.dto.UserRequest;
import hr.ukic.nutrition.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<HttpStatus> registerUser(@RequestBody UserRequest userRequest) {
        authenticationService.registerUser(userRequest);
        return ResponseEntity.ok(HttpStatus.CREATED);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticateUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(authenticationService.authenticateUser(userRequest));
    }
}
