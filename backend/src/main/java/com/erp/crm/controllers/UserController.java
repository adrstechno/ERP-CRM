package com.erp.crm.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.UserDTO;
import com.erp.crm.models.User;
import com.erp.crm.services.UserService;


@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

     //  ✅ Update User
    @PutMapping("/update/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId,@RequestBody UserDTO dto){
         return ResponseEntity.ok(userService.updateUser(userId, dto));
    }

     //  ✅ Delete User
    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId){
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // ✅ get By user id
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId){
        return ResponseEntity.ok( userService.getUserById(userId));
    }

    // ✅ get By user id
    @GetMapping("name/{name}")
    public ResponseEntity<List<User>> getUser(@PathVariable String name){
        return ResponseEntity.ok( userService.getUserByName(name));
    }
}
