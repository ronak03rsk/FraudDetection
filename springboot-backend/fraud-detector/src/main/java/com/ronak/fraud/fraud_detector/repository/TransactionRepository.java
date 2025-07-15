package com.ronak.fraud.fraud_detector.repository;

import com.ronak.fraud.fraud_detector.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
