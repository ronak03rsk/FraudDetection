package com.ronak.fraud.fraud_detector.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "transaction")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "transaction_features", joinColumns = @JoinColumn(name = "transaction_id"))
    @Column(name = "feature")
    private List<Double> features;

    private boolean fraud;  // renamed from isFraud to fraud for Thymeleaf compatibility

    private LocalDateTime timestamp = LocalDateTime.now();
}
