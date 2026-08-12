package com.platform.dto;

import com.platform.entity.Role;

public record UserDto(
        Long id,
        String email,
        String fullName,
        Role role
) {}
