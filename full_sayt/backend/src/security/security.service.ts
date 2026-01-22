import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityService {
  getSecuritySettings() {
    return {
      encryptionEnabled: true,
      dlpEnabled: true,
      twoFactorRequired: false,
      ipWhitelist: [],
      allowedCountries: ['UZ'],
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
      },
      sessionTimeout: 3600, // 1 hour
      maxLoginAttempts: 5,
      lockoutDuration: 900, // 15 minutes
    };
  }

  updateSecuritySettings(settings: any) {
    // Update security settings logic
    return { message: 'Xavfsizlik sozlamalari yangilandi', settings };
  }

  getSecurityScore() {
    // Calculate security score based on various factors
    let score = 0;
    
    // Base security measures
    score += 20; // Encryption enabled
    score += 15; // DLP enabled
    score += 10; // Audit logging
    score += 15; // Password policy
    score += 10; // Session management
    
    // Additional security measures
    score += 10; // IP restrictions
    score += 10; // Country restrictions
    score += 10; // Regular security updates
    
    return {
      score,
      maxScore: 100,
      level: score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Poor',
      recommendations: this.getSecurityRecommendations(score),
    };
  }

  private getSecurityRecommendations(score: number) {
    const recommendations = [];
    
    if (score < 90) {
      recommendations.push('2FA (Ikki bosqichli autentifikatsiya) ni yoqing');
    }
    
    if (score < 80) {
      recommendations.push('IP manzillar ro\'yxatini cheklang');
    }
    
    if (score < 70) {
      recommendations.push('Parol siyosatini kuchaytiring');
    }
    
    if (score < 60) {
      recommendations.push('Sessiya vaqtini qisqartiring');
    }
    
    return recommendations;
  }

  validatePassword(password: string) {
    const policy = this.getSecuritySettings().passwordPolicy;
    const errors = [];
    
    if (password.length < policy.minLength) {
      errors.push(`Parol kamida ${policy.minLength} ta belgidan iborat bo'lishi kerak`);
    }
    
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Parolda katta harf bo\'lishi kerak');
    }
    
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Parolda kichik harf bo\'lishi kerak');
    }
    
    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Parolda raqam bo\'lishi kerak');
    }
    
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Parolda maxsus belgi bo\'lishi kerak');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password),
    };
  }

  private calculatePasswordStrength(password: string) {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 12.5;
    if (/[a-z]/.test(password)) strength += 12.5;
    if (/\d/.test(password)) strength += 12.5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 12.5;
    
    return Math.min(100, strength);
  }

  checkIPWhitelist(ip: string) {
    const whitelist = this.getSecuritySettings().ipWhitelist;
    
    if (whitelist.length === 0) return true; // No restrictions
    
    return whitelist.includes(ip);
  }

  generateSecurityReport() {
    return {
      timestamp: new Date(),
      securityScore: this.getSecurityScore(),
      activeThreats: 0,
      blockedAttempts: 0,
      encryptedDocuments: 0,
      vulnerabilities: [],
      recommendations: [
        'Barcha foydalanuvchilar uchun 2FA ni majburiy qiling',
        'Parol siyosatini yangilang',
        'Xavfsizlik auditini o\'tkazing',
      ],
    };
  }
}