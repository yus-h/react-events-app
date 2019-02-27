package com.localevents.service;

import com.localevents.domain.ContactMessage;
import com.localevents.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactMessageService {

    private ContactMessageRepository contactMessageRepository;

    @Autowired
    public ContactMessageService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public List<ContactMessage> list() {
        return contactMessageRepository.findAll();
    }


    public ContactMessage create(ContactMessage contactMessage) {
        return contactMessageRepository.save(contactMessage);
    }

    public Page<ContactMessage> findAllByOrderByCreatedDateDesc(int page, int size) {
        return contactMessageRepository.findAllByOrderByCreatedDateDesc(new PageRequest(page, size));
    }


}
