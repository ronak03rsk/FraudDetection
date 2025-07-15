package com.ronak.fraud.fraud_detector.controller;

import com.ronak.fraud.fraud_detector.dto.TransactionRequest;
import com.ronak.fraud.fraud_detector.service.FraudDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;

import java.util.Arrays;
import java.util.List;

import jakarta.validation.Valid;
import java.util.Map;

@Controller
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private FraudDetectionService fraudService;

    @PostMapping("/check")
    @ResponseBody
    public ResponseEntity<?> checkTransaction(@Valid @RequestBody TransactionRequest request) {
        boolean isFraud = fraudService.checkFraud(request.getFeatures());
        return ResponseEntity.ok(Map.of("fraud", isFraud));
    }

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok(fraudService.getAll());
    }

    @GetMapping("/view")
    public String viewAllTransactions(Model model) {
        model.addAttribute("transactions", fraudService.getAll());
        return "transactions";
    }

    @GetMapping("/add")
    public String showForm() {
        return "add";
    }

    @GetMapping("/dashboard")
public String dashboard(Model model) {
    // List<Transaction> txns = fraudService.getAll();
    List<com.ronak.fraud.fraud_detector.entity.Transaction> txns = fraudService.getAll();

    int total = txns.size();
    // int fraudCount = (int) txns.stream().filter(Transaction::isFraud).count();
    int fraudCount = (int) txns.stream().filter(txn -> txn.isFraud()).count();

    int safeCount = total - fraudCount;

    model.addAttribute("total", total);
    model.addAttribute("fraudCount", fraudCount);
    model.addAttribute("safeCount", safeCount);

    return "dashboard";
}


    @PostMapping("/add")
    public String handleFormInput(@RequestParam String features) {
        List<Double> featureList = Arrays.stream(features.split(","))
                                         .map(String::trim)
                                         .map(Double::parseDouble)
                                         .toList();

        fraudService.checkFraud(featureList);
        return "redirect:/api/transactions/view";
    }

    @PostMapping("/add-form")
    @ResponseBody
    public ResponseEntity<?> addTransactionForm(@Valid @RequestBody TransactionRequest request) {
        boolean isFraud = fraudService.checkFraud(request.getFeatures());
        return ResponseEntity.ok(Map.of("fraud", isFraud, "message", "Transaction processed successfully"));
    }
}
