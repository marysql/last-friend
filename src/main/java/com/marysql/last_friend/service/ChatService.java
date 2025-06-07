package com.marysql.last_friend.service;

import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;


@Service
public class ChatService {

    private final String apiUrl = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
    private static final String API_TOKEN = System.getenv("HUGGINGFACE_API_TOKEN");


    public String gerarResposta(String pergunta) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiToken);

            Map<String, Object> requestBody = Map.of("inputs", pergunta);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<List> response = restTemplate.exchange(
                    apiUrl, HttpMethod.POST, entity, List.class
            );

            System.out.println("Resposta da Hugging Face: " + response.getBody());

            List<Map<String, String>> result = response.getBody();
            if (result != null && !result.isEmpty()) {
                return result.get(0).get("generated_text");
            } else {
                return "Desculpe, não consegui gerar uma resposta agora.";
            }
        } catch (Exception e) {
            e.printStackTrace(); // Mostra o erro no console
            return "Erro ao processar a resposta da IA: " + e.getMessage();
        }
    }

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000); // 10 segundos
        factory.setReadTimeout(30000);    // 30 segundos
        return new RestTemplate(factory);
    }

}


