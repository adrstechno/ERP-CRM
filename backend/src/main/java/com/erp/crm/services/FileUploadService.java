package com.erp.crm.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;



@Service
public class FileUploadService {

    private final Cloudinary cloudinary;

    public FileUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    private String uploadFileToCloud(MultipartFile file, String folderPath) {
        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "folder", "crm/" + folderPath
            );
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    // Invoices
    public String uploadInvoice(MultipartFile file, Long invoiceId) {
        return uploadFileToCloud(file, "invoices/" + invoiceId);
    }

    // Receipts
    public String uploadReceipt(MultipartFile file, Long expenseId) {
        return uploadFileToCloud(file, "receipts/" + expenseId);
    }

    // Product / Service Images
    public String uploadProductStatus(MultipartFile file, Long productId) {
        return uploadFileToCloud(file, "product-status/" + productId);
    }

    // Generic method if you need other types in the future
    public String uploadCustom(MultipartFile file, String folderPath) {
        return uploadFileToCloud(file, folderPath);
    }

    public String deleteFile(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return result.get("result").toString();
        } catch (IOException e) {
            throw new RuntimeException("File delete failed: " + e.getMessage());
        }
    }
}
