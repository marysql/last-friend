package com.marysql.last_friend.controller;

import com.marysql.last_friend.model.Message;
import com.marysql.last_friend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public String conversar(@RequestBody Message mensagem) {
        return chatService.gerarResposta(mensagem.getTexto());
    }

}