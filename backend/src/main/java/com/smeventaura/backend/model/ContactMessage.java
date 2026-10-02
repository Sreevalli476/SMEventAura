package com.smeventaura.backend.model;
import jakarta.persistence.*;import java.time.LocalDateTime;
@Entity @Table(name="contact_messages") public class ContactMessage { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;@Column(nullable=false) String name;@Column(nullable=false) String phone;@Column(nullable=false,length=2000) String message;@Column(nullable=false) LocalDateTime createdAt=LocalDateTime.now(); public void setName(String v){name=v;}public void setPhone(String v){phone=v;}public void setMessage(String v){message=v;} }
