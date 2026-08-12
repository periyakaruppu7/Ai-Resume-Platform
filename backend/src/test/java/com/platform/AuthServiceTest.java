package com.platform;

import com.platform.dto.AuthRequest;
import com.platform.dto.AuthResponse;
import com.platform.dto.RegisterRequest;
import com.platform.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void testRegisterAndLoginFlow() {
        RegisterRequest registerReq = new RegisterRequest("Test Candidate", "candidate@test.com", "secret123");
        AuthResponse regResponse = authService.register(registerReq);

        assertNotNull(regResponse.token());
        assertEquals("candidate@test.com", regResponse.user().email());
        assertEquals("Test Candidate", regResponse.user().fullName());

        AuthRequest loginReq = new AuthRequest("candidate@test.com", "secret123");
        AuthResponse loginResponse = authService.login(loginReq);

        assertNotNull(loginResponse.token());
        assertEquals("candidate@test.com", loginResponse.user().email());
    }
}
