package com.marysql.last_friend.model;

public class Message {

    private String texto;

    public Message() {} // nome igual ao da classe

    public Message(String texto) {
        this.texto = texto;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }
}
