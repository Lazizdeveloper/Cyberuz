const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { SeedService } = require('./dist/seed/seed.service');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    console.log('🌱 Soxta ma\'lumotlar qo\'shish boshlandi...');
    
    // Avval eski ma'lumotlarni tozalash (admin userdan tashqari)
    await seedService.clearAll();
    
    // Yangi soxta ma'lumotlar qo'shish
    await seedService.seedAll();
    
    console.log('🎉 Soxta ma\'lumotlar muvaffaqiyatli qo\'shildi!');
  } catch (error) {
    console.error('❌ Xatolik yuz berdi:', error);
  } finally {
    await app.close();
  }
}

bootstrap();