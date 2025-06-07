package com.marysql.last_friend.controller;

import com.marysql.last_friend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/mensagem")
    public String enviarMensagem(@RequestParam("texto") String texto, Model model) {
        String resposta = chatService.gerarResposta(texto);
        model.addAttribute("pergunta", texto);
        model.addAttribute("resposta", resposta);
        return "index";
    }
}