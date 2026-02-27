package com.tesis.backend.modules.user.controller;

import com.tesis.backend.modules.user.dto.UserCreateRequest;
import com.tesis.backend.modules.user.dto.UserResponse;
import com.tesis.backend.modules.user.dto.UserUpdateRequest;
import com.tesis.backend.modules.user.service.UserService;
import com.tesis.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ok");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getMany() {
        return userService.getMany();
    }

    @GetMapping("/exists")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Boolean> exists(@RequestParam("email") String email) {
        return Map.of("exists", userService.existsByEmail(email));
    }

    @GetMapping("/{id}")
    public UserResponse getById(
        @PathVariable UUID id,
        @AuthenticationPrincipal AuthenticatedUser currentUser
    ) {
        if (currentUser == null || (!currentUser.hasRole("admin") && !currentUser.getUserId().equals(id))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return userService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse create(@Valid @RequestBody UserCreateRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse update(@PathVariable UUID id, @Valid @RequestBody UserUpdateRequest request) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> deleteById(@PathVariable UUID id) {
        userService.deleteById(id);
        return Map.of("status", 200, "message", "Usuario eliminado");
    }
}
