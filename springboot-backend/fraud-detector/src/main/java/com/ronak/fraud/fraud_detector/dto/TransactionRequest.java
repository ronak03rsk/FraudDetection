package com.ronak.fraud.fraud_detector.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TransactionRequest {

    @NotNull
    private List<Double> features;  // Expecting 29 values
}
