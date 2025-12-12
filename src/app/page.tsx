'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Loader2, Star, Instagram, Facebook, ArrowRight } from 'lucide-react';

// --- Veri Tipleri ---
interface FormData {
  firstname: string;
  phone: string;
  city: string;
  district: string;
  email: string;
  kvkkConsent: boolean;
  marketingConsent: boolean;
  gradeLevel: string;
  currentSchoolType: string;
  webinarPurpose: string;
  urgentNeeds: string[];
  childTraits: string[];
  schoolApproach: string;
  budgetRange: string;
  educationValues: string[];
  postWebinarContent: string[];
  postWebinarOtherText: string;
  platformWishlist: string[];
  platformWishlistOtherText: string;
  mentorFeedback: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  landing_page_url: string;
  referrer: string;
}

const initialFormData: FormData = {
  firstname: '', phone: '', city: '', district: '', email: '',
  kvkkConsent: false, marketingConsent: false,
  gradeLevel: '', currentSchoolType: '', webinarPurpose: '',
  urgentNeeds: [], childTraits: [], schoolApproach: '', budgetRange: '',
  educationValues: [], postWebinarContent: [], postWebinarOtherText: '',
  platformWishlist: [], platformWishlistOtherText: '', mentorFeedback: '',
  utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', utm_term: '',
  landing_page_url: '', referrer: '',
};

// --- Seçenekler ---
const OPTIONS = {
  step2: ['Anaokulu', 'İlkokul', 'Ortaokul', 'Lise'],
  step3: ['Devlet okulu', 'Özel okul', 'Kolej', 'Butik / alternatif okul', 'Şu an okul arayışındayız'],
  step4: ['Okul değişimi planlıyoruz', 'Doğru okul modelini anlamak istiyoruz', 'Kararsızız, yönlendirmeye ihtiyacımız var', 'Gelecek yıllar için bilgi almak istiyoruz', 'Sadece bilinçlenmek istiyoruz'],
  step5: ['Akademik başarı', 'Psikolojik iyi oluş', 'Sınav sürecine hazırlık', 'Bireysel ilgi ve takip', 'Güvenli ve destekleyici ortam'],
  step6: ['Akademik yönü güçlüdür', 'Sosyal ilişkileri kuvvetlidir', 'Duygusal farkındalığı yüksektir', 'Yaratıcıdır; sanat/müzik/tasarım alanlarında kendini ifade eder', 'Analitik düşünme ve problem çözme becerisi gelişmiştir', 'Özgüven ve kendini ifade alanında gelişime açıktır', 'Dikkat/odaklanma-disiplin alanında desteğe ihtiyaç vardır', 'Daha önce akademik/psikolojik destek aldık', 'Düzenli spor, sanat veya hobi faaliyeti vardır', 'Sorumluluk konusunda direnç gösterebilir'],
  step7: ['Akademik', 'Sanat odaklı', 'Spor odaklı', 'Çok yönlü', 'Yurtiçi odaklı', 'Yurtdışı (IB / AP / Cambridge)', 'Mesleki yönü güçlü', 'Butik', 'Kapsayıcı / genel model'],
  step8: ['0 – 250.000 TL', '250.000 – 500.000 TL', '500.000 – 750.000 TL', '750.000 – 1.000.000 TL', '1.000.000 – 1.500.000 TL', '1.500.000 – 2.000.000 TL'],
  step9_young: ['Okulda güven hissi önceliklidir', 'Oyun/etkinlik temelli öğrenmeyi desteklerim', 'Günlük rutinin düzenli olmasını isterim', 'Sosyal beceri gelişimi önceliğimdir', 'Küçük sınıf mevcudunu tercih ederim', 'Öğretmen-öğrenci ilişkisi belirleyicidir', 'Duygusal güven ve aile iletişimi önemlidir'],
  step9_old: ['Güçlü bir akademik sistem isterim', 'Psikolojik–akademik dengenin korunmasını önemserim', 'Bireysel rehberlik ve takip beklerim', 'Kariyer/lise/üniversite yönlendirmesi olmalıdır', 'Özgüveni ve motivasyonu destekleyen okul isterim', 'Program yoğunluğunun dengeli olmasını isterim', 'Hem akademik hem kişisel gelişimi destekleyen bir model ararım'],
  step10: ['Yaş grubuma uygun okul modeli önerileri', 'Rehberlik ve yönlendirme içerikleri', 'Okul seçimi kontrol listesi', 'Birebir danışmanlık hakkında bilgi', 'Webinar özetini almak istiyorum', 'Diğer'],
  step11: ['Okul seçerken dikkat edilmesi gerekenleri sade ve net anlatan kısa rehber yazılar', 'LGS / YKS sürecinde ebeveyn tutumlarını özetleyen infografik makaleler', 'Çocukların öğrenme stillerini anlatan eğlenceli ve uygulanabilir mini içerikler', 'Ergen psikolojisini anlaşılır dille anlatan profesyonel blog yazıları', 'Okul–aile iş birliğini güçlendiren pratik öneri listeleri', 'Eğitimde yeni trendleri anlatan kısa bültenler', 'Çocuk gelişimi üzerine “bilimsel ama sıkmayan” günlük okumalar', 'Farklı okul türlerinin karşılaştırmalı analizleri (akademik–sanat–spor–butik–IB vb.)', 'Yaş gruplarına özel “Doğru Okul Modeli” rehberleri', 'Öğrencilerin ilgi/yeteneklerini anlamaya yönelik kısa testler ve mini değerlendirmeler', 'Aileler için haftalık kısa video eğitimleri (motivasyon, ödev yönetimi, sınav süreci vb.)', 'Eğitim uzmanları, psikologlar ve okul yöneticileriyle yapılan röportajlar', 'Sınav yılı ebeveynleri için ay ay ilerleyen yol haritası rehberleri', 'Diğer'],
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

  useEffect(() => {
    const saved = sessionStorage.getItem('enrollment_form_state');
    if (saved) setFormData(JSON.parse(saved));

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
  }, []);

  useEffect(() => {
    sessionStorage.setItem('enrollment_form_state', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let newProgress = 0;
    if (currentStep <= 4) newProgress = (currentStep / 4) * 75;
    else {
      const remainingSteps = TOTAL_STEPS - 4;
      const currentRemaining = currentStep - 4;
      newProgress = 75 + (currentRemaining / remainingSteps) * 25;
    }
    setProgressPercentage(newProgress);
  }, [currentStep]);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => {
      if (field === 'gradeLevel' && value !== prev.gradeLevel) return { ...prev, [field]: value, educationValues: [] };
      return { ...prev, [field]: value };
    });
  };

  const toggleMultiSelect = (field: keyof FormData, value: string) => {
    const list = (formData[field] as string[]) || [];
    if (list.includes(value)) updateField(field, list.filter((item) => item !== value));
    else updateField(field, [...list, value]);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: 
        return (
          formData.firstname.trim() !== '' &&
          formData.phone.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.district.trim() !== '' &&
          formData.email.trim() !== '' &&
          formData.kvkkConsent === true
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
      if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1);
      else handleSubmit();
    } else {
      setErrorMsg('Lütfen devam etmeden önce zorunlu (*) alanları doldurunuz.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    const scriptUrl = "https://script.google.com/macros/s/AKfycbz1PcHKXzqNC9Vv5kQZmy_fl19xsP9tqGrsRPVmrKM4lz34WThDzbnLvFx5BY2OEbQI3Q/exec"; 

    try {
      const payload = JSON.stringify(formData);
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: payload,
      });
      setSubmitStatus('success');
      sessionStorage.removeItem('enrollment_form_state');
    } catch (err: any) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMsg('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Bileşenler ---
  const SelectionCard = ({ 
    selected, 
    label, 
    type = 'radio', 
    onClick,
    hasInput = false,
    inputValue = '',
    onInputChange = (v: string) => {}
  }: { 
    selected: boolean, 
    label: string, 
    type?: 'radio' | 'checkbox', 
    onClick: () => void,
    hasInput?: boolean,
    inputValue?: string,
    onInputChange?: (val: string) => void
  }) => (
    <div 
      onClick={onClick}
      className={`
        group relative p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start
        ${selected 
          ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
          : 'border-gray-200 hover:border-orange-200 bg-white hover:shadow-sm'
        }
      `}
    >
      <div className={`
        mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mr-4 transition-colors
        ${type === 'radio' ? 'rounded-full' : 'rounded-md'}
        ${selected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'}
      `}>
        {selected && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
      
      <div className="flex-1">
        <span className={`text-base font-medium ${selected ? 'text-gray-900' : 'text-gray-600'}`}>
          {label}
        </span>
        {hasInput && selected && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-1" onClick={(e) => e.stopPropagation()}>
            <input 
              type="text" 
              className="w-full p-2 bg-white border-b-2 border-orange-300 focus:border-orange-600 outline-none text-gray-900 placeholder-gray-400 text-sm transition-colors"
              placeholder="Lütfen belirtiniz..."
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );

  // --- Başarılı Ekranı ---
  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-lg w-full animate-in zoom-in duration-500">
          
          {/* Logo (Büyük, Yeşil Tik Üstünde) */}
          <div className="flex justify-center mb-8">
             {!logoError ? (
                <img src="/logo.png" alt="Eğitimpedia" className="h-20 w-auto object-contain" onError={() => setLogoError(true)} />
             ) : (
                <span className="font-bold text-3xl text-orange-600 tracking-tight">Eğitimpedia</span>
             )}
          </div>

          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Check size={48} />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Talebiniz Alındı</h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Okul tercih ve tavsiye formunuz başarıyla bize ulaştı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.
          </p>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
            <p className="font-semibold text-orange-600">Sizinle eğitim yolculuğunda buluşmak için sabırsızlanıyoruz!</p>
          </div>
          
          <div className="flex justify-center gap-6 mt-8">
            <a href="https://x.com/alikocedu?s=20" target="_blank" className="text-gray-400 hover:text-black transition-colors"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
            <a href="https://www.instagram.com/alikocedu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" className="text-gray-400 hover:text-pink-600 transition-colors"><Instagram size={28} /></a>
            <a href="https://www.facebook.com/alikoc72" target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors"><Facebook size={28} /></a>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // Soru oluşturucu fonksiyonu en tepeye taşıdık (Scope hatasını çözer)
    const renderQuestion = (title: string, field: keyof FormData, options: string[], multi = false, layout: 'grid' | 'list' = 'list', otherField?: keyof FormData) => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
        <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
          {options.map((opt) => (
            <SelectionCard 
              key={opt}
              label={opt}
              selected={(multi ? (formData[field] as string[]).includes(opt) : formData[field] === opt)}
              type={multi ? 'checkbox' : 'radio'}
              onClick={() => multi ? toggleMultiSelect(field, opt) : updateField(field, opt)}
              hasInput={opt === 'Diğer'}
              inputValue={otherField ? (formData[otherField] as string) : ''}
              onInputChange={(val) => otherField && updateField(otherField, val)}
            />
          ))}
        </div>
      </div>
    );

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Veli Bilgileri</h1>
              <p className="text-gray-500 text-sm md:text-base">Eğitim danışmanlığı sürecini başlatmak için bilgilerinizi giriniz.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Adı ve Soyadı <span className="text-orange-600">*</span></label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" placeholder="Ad Soyad" value={formData.firstname} onChange={(e) => updateField('firstname', e.target.value)} />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Telefon Numarası <span className="text-orange-600">*</span></label>
                <input type="tel" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" placeholder="05XX..." value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">E-posta Adresi <span className="text-orange-600">*</span></label>
                <input type="email" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" placeholder="ornek@mail.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">İl <span className="text-orange-600">*</span></label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" placeholder="İstanbul" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">İlçe <span className="text-orange-600">*</span></label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" placeholder="Kadıköy" value={formData.district} onChange={(e) => updateField('district', e.target.value)} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <label className="flex items-start cursor-pointer group">
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${formData.kvkkConsent ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'}`}>
                  {formData.kvkkConsent && <Check size={12} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={formData.kvkkConsent} onChange={(e) => updateField('kvkkConsent', e.target.checked)} />
                <span className="text-sm text-gray-600"><span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">KVKK Aydınlatma Metni</span>'ni okudum ve kabul ediyorum. <span className="text-orange-600">*</span></span>
              </label>
              
              <label className="flex items-start cursor-pointer group">
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${formData.marketingConsent ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'}`}>
                  {formData.marketingConsent && <Check size={12} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={formData.marketingConsent} onChange={(e) => updateField('marketingConsent', e.target.checked)} />
                <span className="text-sm text-gray-600">Tarafıma ticari elektronik ileti gönderilmesini kabul ediyorum.</span>
              </label>
            </div>
          </div>
        );

      case 2: return renderQuestion('Çocuğunuzun Eğitim Kademesi Nedir?', 'gradeLevel', OPTIONS.step2);
      case 3: return renderQuestion('Çocuğunuzun Hâlihazırda Devam Ettiği Okul Türü?', 'currentSchoolType', OPTIONS.step3);
      case 4: return renderQuestion('Webinara Katılma Amacınız?', 'webinarPurpose', OPTIONS.step4);
      case 5: return renderQuestion('Okul Seçimiyle İlgili En Acil İhtiyacınız?', 'urgentNeeds', OPTIONS.step5, true);
      case 6: return renderQuestion('Çocuğunuzu Tanıtan İfadeler?', 'childTraits', OPTIONS.step6, true);
      case 7: return renderQuestion('Çocuğunuz İçin Hangi Tür Okul Yaklaşımını Uygun Görüyorsunuz?', 'schoolApproach', OPTIONS.step7, false, 'grid');
      case 8: return renderQuestion('Yıllık Bütçe Aralığınız?', 'budgetRange', OPTIONS.step8, false, 'grid');
      case 9: 
        const isYoung = ['Anaokulu', 'İlkokul'].includes(formData.gradeLevel);
        const opts = isYoung ? OPTIONS.step9_young : OPTIONS.step9_old;
        return opts.length > 0 
          ? renderQuestion(`Eğitim Yaklaşımınız (${isYoung ? 'Anaokulu & İlkokul' : 'Ortaokul & Lise'})`, 'educationValues', opts, true) 
          : <div className="text-center p-8 text-gray-500">Lütfen önce eğitim kademesini seçiniz.</div>;
      case 10: return renderQuestion('Webinar Sonrasında Hangi İçeriği Almak İstersiniz?', 'postWebinarContent', OPTIONS.step10, true, 'list', 'postWebinarOtherText');
      case 11: return renderQuestion('Keşke Şöyle Bir Platform Olsa Dediğiniz Özellikler?', 'platformWishlist', OPTIONS.step11, true, 'list', 'platformWishlistOtherText');
      case 12: 
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Ebeveyn Mentoru ve Okul Seçim Uzmanı Ali Koç'tan En Çok Hangi Konuda İçerik Duymak İstersiniz?</h2>
            <div className="relative">
              <textarea 
                className="w-full p-5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all text-lg resize-none min-h-[200px]"
                placeholder="Örn: Sınav kaygısı ile nasıl baş edebilirim?"
                maxLength={200}
                value={formData.mentorFeedback}
                onChange={(e) => updateField('mentorFeedback', e.target.value)}
              />
              <div className="text-right text-xs text-gray-400 mt-2">{formData.mentorFeedback.length}/200</div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 flex items-center justify-center p-4 selection:bg-orange-100">
      
      {/* Top Header Fixed */}
      <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             {!logoError ? (
                <img src="/logo.png" alt="Eğitimpedia" className="h-8 w-auto object-contain" onError={() => setLogoError(true)} />
             ) : (
                <span className="font-bold text-xl text-orange-600 tracking-tight">Eğitimpedia</span>
             )}
          </div>
          {/* Başvuru Sihirbazı yazısı kaldırıldı */}
        </div>
        {/* Progress Line */}
        <div className="h-1 bg-gray-100 w-full">
          <div className="h-full bg-orange-600 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <div className="w-full max-w-2xl mt-20 mb-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-10 min-h-[400px] flex flex-col justify-center">
            {renderContent()}
          </div>
          
          {errorMsg && (
            <div className="px-6 md:px-10 pb-4">
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center animate-pulse">
                <AlertCircle size={18} className="mr-2" /> {errorMsg}
              </div>
            </div>
          )}

          <div className="bg-gray-50 px-6 md:px-10 py-6 border-t border-gray-100 flex justify-between items-center">
            <button 
              onClick={handleBack} 
              disabled={currentStep === 1 || isSubmitting}
              className={`
                flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${currentStep === 1 
                  ? 'text-gray-300 cursor-not-allowed opacity-0' 
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }
              `}
            >
              <ChevronLeft size={18} className="mr-1" /> Geri
            </button>

            <button 
              onClick={handleNext} 
              disabled={isSubmitting}
              className={`
                flex items-center px-8 py-3 rounded-lg text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all transform active:scale-95
                ${isSubmitting ? 'bg-orange-300 cursor-wait' : 'bg-orange-600 hover:bg-orange-700'}
              `}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : currentStep === TOTAL_STEPS ? (
                <>Tamamla <Check size={18} className="ml-2" /></>
              ) : (
                <>Devam Et <ArrowRight size={18} className="ml-2" /></>
              )}
            </button>
          </div>
        </div>
        
        <div className="text-center mt-6 text-xs text-gray-400">
          Adım {currentStep} / {TOTAL_STEPS}
        </div>
      </div>
    </div>
  );
}
