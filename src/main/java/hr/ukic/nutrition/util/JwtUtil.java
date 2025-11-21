package hr.ukic.nutrition.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private String jwtSecret = "IWGyeWvE31lmPs1Q9dkH6cTLljliUwgGIWGyeWvE31lmPs1Q9dkH6cTLljliUwgGIWGyeWvE31lmPs1Q9dkH6cTLljliUwgGIWGyeWvE31lmPs1Q9dkH6cTLljliUwgGIWGyeWvE31lmPs1Q9dkH6cTLljliUwgGIWGyeWvE31lmPs1Q9dkH6cTLljliUwgG";
    private long jwtExpirationDate = 36000000;

    public String generateToken(Authentication authentication) {

        String username = authentication.getName();
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder().claims(claims).subject(username).issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationDate))
                .signWith(getSignInKey(), Jwts.SIG.HS256).compact();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    public String getUsername(String token){

        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token){
        Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parse(token);
        return true;

    }
}
