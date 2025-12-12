'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Loader2, Star, Instagram, Facebook } from 'lucide-react';

// --- Types & Interfaces ---

interface FormData {
  // Step 1: Veli Bilgileri
  firstname: string;
  phone: string;
  city: string;
  district: string;
  email: string;
  kvkkConsent: boolean;
  marketingConsent: boolean;

  // Step 2: Grade
  gradeLevel: string;

  // Step 3: Current School
  currentSchoolType: string;

  // Step 4: Purpose
  webinarPurpose: string;

  // Step 5: Needs (Multi)
  urgentNeeds: string[];

  // Step 6: Child Traits (Multi)
  childTraits: string[];

  // Step 7: Approach
  schoolApproach: string;

  // Step 8: Budget
  budgetRange: string;

  // Step 9: Conditional Approach (Multi)
  educationValues: string[];

  // Step 10: Post Webinar Content (Multi)
  postWebinarContent: string[];
  postWebinarOtherText: string;

  // Step 11: Wishlist (Multi)
  platformWishlist: string[];
  platformWishlistOtherText: string;

  // Step 12: Mentor
  mentorFeedback: string;

  // Hidden / Context
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  landing_page_url: string;
  referrer: string;
}

const initialFormData: FormData = {
  firstname: '',
  phone: '',
  city: '',
  district: '',
  email: '',
  kvkkConsent: false,
  marketingConsent: false,
  gradeLevel: '',
  currentSchoolType: '',
  webinarPurpose: '',
  urgentNeeds: [],
  childTraits: [],
  schoolApproach: '',
  budgetRange: '',
  educationValues: [],
  postWebinarContent: [],
  postWebinarOtherText: '',
  platformWishlist: [],
  platformWishlistOtherText: '',
  mentorFeedback: '',
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_content: '',
  utm_term: '',
  landing_page_url: '',
  referrer: '',
};

// --- Options Constants ---

const OPTIONS = {
  step2: ['Anaokulu', 'İlkokul', 'Ortaokul', 'Lise'],
  step3: [
    'Devlet okulu',
    'Özel okul',
    'Kolej',
    'Butik / alternatif okul',
    'Şu an okul arayışındayız',
  ],
  step4: [
    'Okul değişimi planlıyoruz',
    'Doğru okul modelini anlamak istiyoruz',
    'Kararsızız, yönlendirmeye ihtiyacımız var',
    'Gelecek yıllar için bilgi almak istiyoruz',
    'Sadece bilinçlenmek istiyoruz',
  ],
  step5: [
    'Akademik başarı',
    'Psikolojik iyi oluş',
    'Sınav sürecine hazırlık',
    'Bireysel ilgi ve takip',
    'Güvenli ve destekleyici ortam',
  ],
  step6: [
    'Akademik yönü güçlüdür',
    'Sosyal ilişkileri kuvvetlidir',
    'Duygusal farkındalığı yüksektir',
    'Yaratıcıdır; sanat/müzik/tasarım alanlarında kendini ifade eder',
    'Analitik düşünme ve problem çözme becerisi gelişmiştir',
    'Özgüven ve kendini ifade alanında gelişime açıktır',
    'Dikkat/odaklanma-disiplin alanında desteğe ihtiyaç vardır',
    'Daha önce akademik/psikolojik destek aldık',
    'Düzenli spor, sanat veya hobi faaliyeti vardır',
    'Sorumluluk konusunda direnç gösterebilir',
  ],
  step7: [
    'Akademik',
    'Sanat odaklı',
    'Spor odaklı',
    'Çok yönlü',
    'Yurtiçi odaklı',
    'Yurtdışı (IB / AP / Cambridge)',
    'Mesleki yönü güçlü',
    'Butik',
    'Kapsayıcı / genel model',
  ],
  step8: [
    '0 – 250.000 TL',
    '250.000 – 500.000 TL',
    '500.000 – 750.000 TL',
    '750.000 – 1.000.000 TL',
    '1.000.000 – 1.500.000 TL',
    '1.500.000 – 2.000.000 TL',
  ],
  step9_young: [
    'Okulda güven hissi önceliklidir',
    'Oyun/etkinlik temelli öğrenmeyi desteklerim',
    'Günlük rutinin düzenli olmasını isterim',
    'Sosyal beceri gelişimi önceliğimdir',
    'Küçük sınıf mevcudunu tercih ederim',
    'Öğretmen-öğrenci ilişkisi belirleyicidir',
    'Duygusal güven ve aile iletişimi önemlidir',
  ],
  step9_old: [
    'Güçlü bir akademik sistem isterim',
    'Psikolojik–akademik dengenin korunmasını önemserim',
    'Bireysel rehberlik ve takip beklerim',
    'Kariyer/lise/üniversite yönlendirmesi olmalıdır',
    'Özgüveni ve motivasyonu destekleyen okul isterim',
    'Program yoğunluğunun dengeli olmasını isterim',
    'Hem akademik hem kişisel gelişimi destekleyen bir model ararım',
  ],
  step10: [
    'Yaş grubuma uygun okul modeli önerileri',
    'Rehberlik ve yönlendirme içerikleri',
    'Okul seçimi kontrol listesi',
    'Birebir danışmanlık hakkında bilgi',
    'Webinar özetini almak istiyorum',
    'Diğer',
  ],
  step11: [
    'Okul seçerken dikkat edilmesi gerekenleri sade ve net anlatan kısa rehber yazılar',
    'LGS / YKS sürecinde ebeveyn tutumlarını özetleyen infografik makaleler',
    'Çocukların öğrenme stillerini anlatan eğlenceli ve uygulanabilir mini içerikler',
    'Ergen psikolojisini anlaşılır dille anlatan profesyonel blog yazıları',
    'Okul–aile iş birliğini güçlendiren pratik öneri listeleri',
    'Eğitimde yeni trendleri anlatan kısa bültenler',
    'Çocuk gelişimi üzerine “bilimsel ama sıkmayan” günlük okumalar',
    'Farklı okul türlerinin karşılaştırmalı analizleri (akademik–sanat–spor–butik–IB vb.)',
    'Yaş gruplarına özel “Doğru Okul Modeli” rehberleri',
    'Öğrencilerin ilgi/yeteneklerini anlamaya yönelik kısa testler ve mini değerlendirmeler',
    'Aileler için haftalık kısa video eğitimleri (motivasyon, ödev yönetimi, sınav süreci vb.)',
    'Eğitim uzmanları, psikologlar ve okul yöneticileriyle yapılan röportajlar',
    'Sınav yılı ebeveynleri için ay ay ilerleyen yol haritası rehberleri',
    'Diğer',
  ],
};

const TOTAL_STEPS = 12;

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [logoError, setLogoError] = useState(false);

  // --- Initialization & Persistence ---

  useEffect(() => {
    // Load from SessionStorage
    const saved = sessionStorage.getItem('enrollment_form_state');
    if (saved) {
      setFormData(JSON.parse(saved));
    }

    // Capture URL params & Context
    const params = new URLSearchParams(window.location.search);
    setFormData((prev) => ({
      ...prev,
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      landing_page_url: window.location.href,
      referrer: document.referrer,
    }));

    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'form_start' });
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('enrollment_form_state', JSON.stringify(formData));
  }, [formData]);

  // --- Manipulative Progress Bar Logic ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Logic: First 4 steps fill 75% of the bar. Remaining 8 steps fill the rest 25%.
    let newProgress = 0;
    if (currentStep <= 4) {
      newProgress = (currentStep / 4) * 75;
    } else {
      const remainingSteps = TOTAL_STEPS - 4;
      const currentRemaining = currentStep - 4;
      newProgress = 75 + (currentRemaining / remainingSteps) * 25;
    }
    
    setProgressPercentage(newProgress);

    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'step_view',
        step_number: currentStep,
      });
    }
  }, [currentStep]);

  // --- Logic Helpers ---

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => {
      if (field === 'gradeLevel' && value !== prev.gradeLevel) {
        return { ...prev, [field]: value, educationValues: [] };
      }
      return { ...prev, [field]: value };
    });
  };

  const toggleMultiSelect = (field: keyof FormData, value: string) => {
    const list = (formData[field] as string[]) || [];
    if (list.includes(value)) {
      updateField(field, list.filter((item) => item !== value));
    } else {
      updateField(field, [...list, value]);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!formData.firstname &&
          !!formData.phone &&
          !!formData.city &&
          !!formData.district &&
          !!formData.email &&
          formData.kvkkConsent
        );
      case 2: return !!formData.gradeLevel;
      case 3: return !!formData.currentSchoolType;
      case 4: return !!formData.webinarPurpose;
      case 5: return formData.urgentNeeds.length > 0;
      case 7: return !!formData.schoolApproach;
      case 8: return !!formData.budgetRange;
      case 9: return formData.educationValues.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } else {
      alert('Lütfen zorunlu alanları doldurunuz.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // --- Google Sheets Submission ---

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    // Doğrudan kullanıcının sağladığı URL'i kullanıyoruz.
    const scriptUrl = "https://script.google.com/a/macros/alikocedu.com/s/AKfycbz1PcHKXzqNC9Vv5kQZmy_fl19xsP9tqGrsRPVmrKM4lz34WThDzbnLvFx5BY2OEbQI3Q/exec";

    try {
      const payload = JSON.stringify(formData);

      await fetch(scriptUrl, {
        method: 'POST',
        // 'no-cors' Google Apps Script için kritiktir. 
        // Yanıtın içeriğini okuyamayız ama gönderim başarılı olur.
        mode: 'no-cors', 
        headers: {
          // 'application/json' yerine 'text/plain' kullanmak CORS "preflight" hatasını engeller.
          // Google Apps Script JSON.parse(e.postData.contents) ile bunu yine de okuyabilir.
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: payload,
      });

      // no-cors modunda hata yakalamak zordur, fetch hata fırlatmadıysa başarılı sayarız.
      setSubmitStatus('success');
      
      if ((window as any).dataLayer) {
          (window as any).dataLayer.push({ event: 'form_submit_success' });
      }
      if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead');
      }
      sessionStorage.removeItem('enrollment_form_state');

    } catch (err: any) {
      console.error(err);
      setSubmitStatus('error'); 
      setErrorMsg('Bir hata oluştu. Lütfen tekrar deneyiniz.');
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'form_submit_error', error: err.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renderers ---

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in zoom-in duration-500">
          
          {/* Logo on Success Screen */}
          <div className="flex justify-center mb-6">
            {!logoError ? (
               <img 
                  src="/logo.png" 
                  alt="Eğitimpedia" 
                  className="h-16 w-auto object-contain"
                  onError={() => setLogoError(true)}
               />
             ) : (
               <div className="text-2xl font-bold text-orange-600">Eğitimpedia</div>
             )}
          </div>

          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Harika! 🎉</h2>
          
          <p className="text-gray-800 text-lg font-medium mb-2">
            Okul tercih tavsiye talebiniz başarıyla alındı.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            En kısa sürede iletişime geçeceğiz. <br/>
            <span className="text-orange-600 font-medium">Sizinle eğitim yolculuğunda buluşmak için sabırsızlanıyoruz!</span>
          </p>

          {/* Social Media Links */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-center gap-4">
              {/* X (Twitter) */}
              <a 
                href="https://x.com/alikocedu?s=20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-black text-white rounded-full hover:scale-110 hover:shadow-lg transition-all duration-300"
                aria-label="X (Twitter)"
              >
                {/* Custom X Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/alikocedu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-full hover:scale-110 hover:shadow-lg transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/alikoc72" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-[#1877F2] text-white rounded-full hover:scale-110 hover:shadow-lg transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const renderSingleSelect = (
    field: keyof FormData,
    options: string[],
    layout: 'list' | 'grid' = 'list'
  ) => (
    <div className={`${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}`}>
      {options.map((opt, idx) => (
        <label
          key={opt}
          style={{ animationDelay: `${idx * 50}ms` }}
          className={`
            relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.01] hover:shadow-md animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards
            ${
              formData[field] === opt
                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200 ring-opacity-50'
                : 'border-gray-200 hover:border-orange-300 bg-white'
            }
          `}
        >
          <input
            type="radio"
            name={field}
            value={opt}
            checked={formData[field] === opt}
            onChange={() => updateField(field, opt)}
            className="hidden"
          />
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${formData[field] === opt ? 'border-orange-500' : 'border-gray-300'}`}>
            {formData[field] === opt && <div className="w-3 h-3 rounded-full bg-orange-500 animate-in zoom-in duration-200" />}
          </div>
          <span className={`text-base font-medium ${formData[field] === opt ? 'text-orange-900' : 'text-gray-700'}`}>
            {opt}
          </span>
        </label>
      ))}
    </div>
  );

  const renderMultiSelect = (field: keyof FormData, options: string[], otherTextField?: keyof FormData) => (
    <div className="space-y-3">
      {options.map((opt, idx) => {
        const isChecked = (formData[field] as string[]).includes(opt);
        const isOther = opt === 'Diğer';
        
        return (
          <div key={opt} className="animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards" style={{ animationDelay: `${idx * 50}ms` }}>
            <label
              className={`
                flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all select-none transform hover:scale-[1.01] hover:shadow-sm
                ${
                  isChecked
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleMultiSelect(field, opt)}
                className="hidden"
              />
              <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-all ${isChecked ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-white'}`}>
                {isChecked && <Check size={16} className="text-white animate-in zoom-in duration-200" />}
              </div>
              <span className={`text-base font-medium ${isChecked ? 'text-orange-900' : 'text-gray-700'}`}>
                {opt}
              </span>
            </label>
            
            {isOther && isChecked && otherTextField && (
               <div className="ml-10 mt-2 animate-in slide-in-from-top-2 fade-in">
                  <input 
                    type="text" 
                    className="w-full p-3 border-b-2 border-orange-300 bg-gray-50 rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-all text-sm"
                    placeholder="Lütfen belirtiniz..."
                    value={(formData[otherTextField] as string)}
                    onChange={(e) => updateField(otherTextField, e.target.value)}
                    autoFocus
                  />
               </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Veli Bilgileri
            </h2>
            
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">VELİNİN ADI VE SOYADI <span className="text-orange-500">*</span></label>
              <input
                type="text"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                placeholder="Örn: Zeynep Demir"
                value={formData.firstname}
                onChange={(e) => updateField('firstname', e.target.value)}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">TELEFON NUMARASI <span className="text-orange-500">*</span></label>
              <input
                type="tel"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                placeholder="05XX XXX XX XX"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">İL <span className="text-orange-500">*</span></label>
                <input
                  type="text"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  placeholder="İstanbul"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">İLÇE <span className="text-orange-500">*</span></label>
                <input
                  type="text"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  placeholder="Kadıköy"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">E-POSTA ADRESİ <span className="text-orange-500">*</span></label>
              <input
                type="email"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>

            <div className="pt-4 space-y-3">
              <label className="flex items-start cursor-pointer group">
                <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all ${formData.kvkkConsent ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white group-hover:border-orange-300'}`}>
                   {formData.kvkkConsent && <Check size={14} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.kvkkConsent}
                  onChange={(e) => updateField('kvkkConsent', e.target.checked)}
                />
                <span className="text-sm text-gray-600 leading-tight pt-0.5">
                  <span className="font-bold text-gray-900">KVKK Aydınlatma Metni</span>'ni okudum ve kabul ediyorum. <span className="text-orange-500">*</span>
                </span>
              </label>
              
              <label className="flex items-start cursor-pointer group">
                 <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all ${formData.marketingConsent ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white group-hover:border-orange-300'}`}>
                   {formData.marketingConsent && <Check size={14} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.marketingConsent}
                  onChange={(e) => updateField('marketingConsent', e.target.checked)}
                />
                <span className="text-sm text-gray-600 leading-tight pt-0.5">
                  Tarafıma ticari elektronik ileti gönderilmesini kabul ediyorum.
                </span>
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Çocuğunuzun Eğitim Kademesi Nedir?</h2>
            {renderSingleSelect('gradeLevel', OPTIONS.step2)}
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Çocuğunuzun Hâlihazırda Devam Ettiği Okul Türü Hangisidir?</h2>
            {renderSingleSelect('currentSchoolType', OPTIONS.step3)}
          </>
        );

      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Webinara Katılma Amacınız Size Hangisine Daha Yakın?</h2>
            {renderSingleSelect('webinarPurpose', OPTIONS.step4)}
          </>
        );

      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Okul Seçimiyle İlgili En Acil İhtiyacınız Hangileridir? <span className="text-base font-normal text-gray-500 block mt-1">(Birden fazla seçilebilir)</span></h2>
            {renderMultiSelect('urgentNeeds', OPTIONS.step5)}
          </>
        );

      case 6:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Çocuğunuzu Daha Doğru Tanıyabilmemiz İçin Aşağıdaki İfadelerden Size Uygun Olanları İşaretleyiniz: <span className="text-base font-normal text-gray-500 block mt-1">(Birden fazla seçilebilir)</span></h2>
            {renderMultiSelect('childTraits', OPTIONS.step6)}
          </>
        );

      case 7:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Çocuğunuz İçin Hangi Tür Okul Yaklaşımını Daha Uygun Görüyorsunuz?</h2>
            {renderSingleSelect('schoolApproach', OPTIONS.step7, 'grid')}
          </>
        );

      case 8:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Okul İçin Yıllık Ayırdığınız / Ayırmayı Planladığınız Bütçe Aralığı Nedir?</h2>
            {renderSingleSelect('budgetRange', OPTIONS.step8, 'grid')}
          </>
        );

      case 9:
        const isYoung = ['Anaokulu', 'İlkokul'].includes(formData.gradeLevel);
        const isOld = ['Ortaokul', 'Lise'].includes(formData.gradeLevel);
        let optionsToRender: string[] = [];
        
        if (isYoung) optionsToRender = OPTIONS.step9_young;
        else if (isOld) optionsToRender = OPTIONS.step9_old;
        else optionsToRender = [];

        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Eğitim Yaklaşımınızı En İyi Yansıtan İfadeleri İşaretleyiniz: <span className="text-base font-normal text-gray-500 block mt-1">({isYoung ? 'Anaokulu & İlkokul' : 'Ortaokul & Lise'} için) <br/>(Birden fazla seçilebilir)</span></h2>
            {optionsToRender.length > 0 ? (
              renderMultiSelect('educationValues', optionsToRender)
            ) : (
              <div className="text-red-500 font-medium p-4 bg-red-50 rounded-lg">Lütfen önce eğitim kademesini (Adım 2) seçiniz.</div>
            )}
          </>
        );

      case 10:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Webinar Sonrasında Hangi İçeriği Almak İstersiniz? <span className="text-base font-normal text-gray-500 block mt-1">(Opsiyonel, Birden fazla seçilebilir)</span></h2>
            {renderMultiSelect('postWebinarContent', OPTIONS.step10, 'postWebinarOtherText')}
          </>
        );

      case 11:
        return (
          <>
             <h2 className="text-2xl font-bold text-gray-900 mb-6">“Keşke şöyle bir platform olsa da şu bilgiye hemen ulaşsam” dediğiniz şey nedir? <span className="text-base font-normal text-gray-500 block mt-1">(Opsiyonel, Birden fazla seçilebilir)</span></h2>
             <div className="bg-orange-50 p-4 rounded-xl mb-6 text-sm text-orange-800 border border-orange-100 flex items-start">
               <Star className="flex-shrink-0 mr-2 text-orange-500" size={18} />
               Hayalinizdeki eğitim platformunu birlikte tasarlayalım!
             </div>
             {renderMultiSelect('platformWishlist', OPTIONS.step11, 'platformWishlistOtherText')}
          </>
        );

      case 12:
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ebeveyn Mentoru ve Okul Seçim Uzmanı Olarak Benden En Çok Hangi Konuda İçerik Duymak İstersiniz? <span className="text-base font-normal text-gray-500 block mt-1">(Opsiyonel)</span></h2>
            <div className="relative">
              <textarea
                className="w-full p-5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 min-h-[150px] outline-none transition-all resize-none text-lg"
                placeholder="Merak ettiğiniz konuları buraya yazabilirsiniz..."
                maxLength={200}
                value={formData.mentorFeedback}
                onChange={(e) => updateField('mentorFeedback', e.target.value)}
              ></textarea>
              <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 rounded-md">
                {formData.mentorFeedback.length}/200
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 selection:bg-orange-200">
      
      {/* Top Logo Bar - Kullanıcının eklediği logo.png dosyasını kullanır */}
      <div className="fixed top-2 left-4 z-[60]">
        {!logoError ? (
           <img 
              src="/logo.png" 
              alt="Eğitimpedia" 
              className="h-12 w-auto object-contain"
              onError={() => setLogoError(true)}
           />
         ) : (
           <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-100 font-bold text-orange-600 text-lg">
             Eğitimpedia
           </div>
         )}
      </div>

      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="max-w-xl mx-auto px-4 py-16 md:py-20 pb-32">
        {/* Step Indicator */}
        <div className="mb-8 flex justify-between items-end px-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-orange-500 tracking-widest uppercase mb-1">EĞİTİM YOLCULUĞU</span>
            <span className="text-2xl font-extrabold text-gray-900">
              Adım {currentStep} <span className="text-gray-300 text-lg font-medium">/ {TOTAL_STEPS}</span>
            </span>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-orange-600 mb-1">{Math.round(progressPercentage)}%</div>
             <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{ width: `${progressPercentage}%` }}></div>
             </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 relative overflow-hidden transition-all">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

          {renderStepContent()}
        </div>

        {/* Error Message */}
        {errorMsg && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center text-sm border border-red-100 shadow-sm animate-in shake">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                {errorMsg}
            </div>
        )}

        {/* Navigation Actions */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className={`
              flex items-center justify-center px-6 py-4 rounded-xl font-bold transition-all
              ${currentStep === 1 
                ? 'text-gray-300 cursor-not-allowed opacity-50' 
                : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md bg-transparent'
              }
            `}
          >
            <ChevronLeft size={22} className="mr-1" />
            Geri
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`
              flex items-center justify-center px-10 py-4 rounded-xl font-bold text-white shadow-lg shadow-orange-500/30 transition-all transform active:scale-95 hover:-translate-y-1
              ${isSubmitting ? 'bg-orange-400 cursor-wait' : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40'}
            `}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : currentStep === TOTAL_STEPS ? (
              <>
                Kaydı Tamamla
                <Check size={22} className="ml-2" />
              </>
            ) : (
              <>
                Devam Et
                <ChevronRight size={22} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}