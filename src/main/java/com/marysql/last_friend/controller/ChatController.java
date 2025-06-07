package com.marysql.last_friend.controller;


import com.marysql.last_friend.service.ChatService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/perguntar")
    public ResponseEntity<String> perguntar(@RequestBody Map<String, String> body) {
        String pergunta = body.get("texto");
        String resposta = chatService.gerarResposta(pergunta);
        return ResponseEntity.ok(resposta);
    }
}
