package com.marysql.last_friend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ChatService {

    @Value("${cohere.api.key}")
    private String apiKey;

    private final String apiUrl = "https://api.cohere.ai/v1/generate";

    public String gerarResposta(String pergunta) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> requestBody = Map.of(
                    "model", "command-r-plus",  // Modelo mais robusto e gratuito para testes
                    "prompt", pergunta,
                    "max_tokens", 100,
                    "temperature", 0.7
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl, HttpMethod.POST, entity, Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("generations")) {
                var generations = (java.util.List<Map<String, String>>) responseBody.get("generations");
                if (!generations.isEmpty()) {
                    return generations.get(0).get("text").trim();
                }
            }

            return "Desculpe, não consegui gerar uma resposta agora.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao processar a resposta da IA: " + e.getMessage();
        }
    }
}
