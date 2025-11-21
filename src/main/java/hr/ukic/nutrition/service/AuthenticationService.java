package hr.ukic.nutrition.service;

import hr.ukic.nutrition.dto.AuthenticationResponse;
import hr.ukic.nutrition.dto.UserRequest;
import hr.ukic.nutrition.model.User;
import hr.ukic.nutrition.repository.UserRepository;
import hr.ukic.nutrition.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;


    public void registerUser(UserRequest userRequest) {
        User user = new User();
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setUsername(userRequest.getUsername());
        userRepository.save(user);
    }

    public AuthenticationResponse authenticateUser(UserRequest userRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userRequest.getUsername(), userRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            final String jwt = jwtUtil.generateToken(authentication);
            return new AuthenticationResponse(jwt);
        } catch (Exception e) {
            throw new RuntimeException("Invalid username/password supplied");
        }
    }
}
