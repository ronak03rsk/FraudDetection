package com.ronak.fraud.fraud_detector.service;

import com.ronak.fraud.fraud_detector.entity.Transaction;
import com.ronak.fraud.fraud_detector.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FraudDetectionService {

    @Autowired
    private TransactionRepository repository;

    private final String ML_API_URL = "http://localhost:5000/predict";

    public boolean checkFraud(List<Double> features) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("features", features);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(ML_API_URL, entity, (Class<Map<String, Object>>)(Class<?>)Map.class);

        boolean isFraud = (Boolean) response.getBody().get("fraud");

        Transaction txn = new Transaction();
        txn.setFeatures(features);
        txn.setFraud(isFraud);
        txn.setTimestamp(LocalDateTime.now());

        repository.save(txn);
        return isFraud;
    }

    public List<Transaction> getAll() {
        return repository.findAll();
    }
}
