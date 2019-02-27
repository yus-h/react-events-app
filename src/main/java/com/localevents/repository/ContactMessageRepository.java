package com.localevents.repository;

import com.localevents.domain.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {

    Page<ContactMessage> findAllByOrderByCreatedDateDesc(Pageable pageable);
}

