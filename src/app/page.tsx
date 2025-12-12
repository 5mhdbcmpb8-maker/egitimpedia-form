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
  currentSchoolType: string[]; // Çoklu seçim için dizi yapıldı
  webinarPurpose: string[];    // Çoklu seçim için dizi yapıldı
  urgentNeeds: string[];
  childTraits: string[];
  schoolApproach: string[];    // Çoklu seçim için dizi yapıldı
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
  gradeLevel: '',
  currentSchoolType: [], // Dizi olarak başlatıldı
  webinarPurpose: [],    // Dizi olarak başlatıldı
  urgentNeeds: [], 
  childTraits: [], 
  schoolApproach: [],    // Dizi olarak başlatıldı
  budgetRange: '',
  educationValues: [], postWebinarContent: [], postWebinarOtherText: '',
  platformWishlist: [], platformWishlistOtherText: '', mentorFeedback: '',
  utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', utm_term: '',
  landing_page_url: '', referrer: '',
};

// --- Seçenekler ---
const OPTIONS = {
  step2: ['Anaokulu', 'İlkokul', 'Ortaokul', 'Lise'],
  // "Özel okul" -> "Yabancı Özel Okul" olarak güncellendi
  step3: ['Devlet okulu', 'Yabancı Özel Okul', 'Kolej', 'Butik / alternatif okul', 'Şu an okul arayışındayız'],
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
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
      // Çoklu seçim olduğu için dizi uzunluğunu kontrol ediyoruz
      case 3: return formData.currentSchoolType.length > 0;
      case 4: return formData.webinarPurpose.length > 0;
      case 5: return formData.urgentNeeds.length > 0;
      case 7: return formData.schoolApproach.length > 0;
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
      const errorDiv = document.getElementById('error-message');
      if(errorDiv) errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setErrorMsg(''), 4000);
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
      // Çoklu seçim alanlarını string'e çevirerek gönderiyoruz ki Sheets'te tek hücrede görünsün
      const payloadData = {
        ...formData,
        currentSchoolType: formData.currentSchoolType.join(', '),
        webinarPurpose: formData.webinarPurpose.join(', '),
        schoolApproach: formData.schoolApproach.join(', ')
      };

      const payload = JSON.stringify(payloadData);
      
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
        group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start
        ${selected 
          ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100 ring-1 ring-orange-200' 
          : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50'
        }
      `}
    >
      <div className={`
        mt-0.5 w-6 h-6 flex items-center justify-center flex-shrink-0 mr-4 transition-all duration-300
        ${type === 'radio' ? 'rounded-full' : 'rounded-lg'}
        ${selected ? 'bg-orange-500 scale-110 shadow-sm' : 'border-2 border-gray-300 bg-gray-50 group-hover:border-orange-300'}
      `}>
        {selected && <Check size={14} className="text-white" strokeWidth={3} />}
      </div>
      
      <div className="flex-1">
        <span className={`text-base font-medium leading-relaxed ${selected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'}`}>
          {label}
        </span>
        {hasInput && selected && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
            <input 
              type="text" 
              className="w-full p-3 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100/50 outline-none text-gray-900 placeholder-gray-400 text-sm transition-all"
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-lg w-full bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-gray-200 animate-in zoom-in duration-500">
          
          {/* Logo (Büyük, Yeşil Tik Üstünde) */}
          <div className="flex justify-center mb-8">
             {!logoError ? (
                <img src="/logo.png" alt="Eğitimpedia" className="h-20 w-auto object-contain" onError={() => setLogoError(true)} />
             ) : (
                <span className="font-bold text-3xl text-orange-600 tracking-tight">Eğitimpedia</span>
             )}
          </div>

          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-green-200 shadow-lg animate-bounce">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Talebiniz Alındı!</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed font-medium">
            Okul tercih ve tavsiye formunuz başarıyla bize ulaştı. <br/>
            <span className="text-orange-600 font-semibold">Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.</span>
          </p>
          
          <div className="flex justify-center gap-6 mt-8 border-t border-gray-100 pt-8">
            <a href="https://x.com/alikocedu?s=20" target="_blank" className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white hover:scale-110 transition-all duration-300"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
            <a href="https://www.instagram.com/alikocedu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-pink-600 hover:text-white hover:scale-110 transition-all duration-300"><Instagram size={24} /></a>
            <a href="https://www.facebook.com/alikoc72" target="_blank" className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300"><Facebook size={24} /></a>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const renderQuestion = (title: string, field: keyof FormData, options: string[], multi = false, layout: 'grid' | 'list' = 'list', otherField?: keyof FormData) => (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">{title}</h2>
        <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
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
            <div className="space-y-3 mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Eğitim Yolculuğu Başlıyor</h1>
              <p className="text-gray-500 text-base md:text-lg font-medium">Sizi ve çocuğunuzu daha yakından tanımak için lütfen bilgilerinizi giriniz.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wide">Adı ve Soyadı <span className="text-orange-500">*</span></label>
                <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-medium text-gray-900" placeholder="Ad Soyad" value={formData.firstname} onChange={(e) => updateField('firstname', e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wide">Telefon Numarası <span className="text-orange-500">*</span></label>
                <input type="tel" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-medium text-gray-900" placeholder="05XX..." value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wide">E-posta Adresi <span className="text-orange-500">*</span></label>
                <input type="email" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-medium text-gray-900" placeholder="ornek@mail.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wide">İl <span className="text-orange-500">*</span></label>
                <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-medium text-gray-900" placeholder="İstanbul" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wide">İlçe <span className="text-orange-500">*</span></label>
                <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-medium text-gray-900" placeholder="Kadıköy" value={formData.district} onChange={(e) => updateField('district', e.target.value)} />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <label className="flex items-start cursor-pointer group p-3 -ml-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-3 transition-colors flex-shrink-0 ${formData.kvkkConsent ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white group-hover:border-orange-400'}`}>
                  {formData.kvkkConsent && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <input type="checkbox" className="hidden" checked={formData.kvkkConsent} onChange={(e) => updateField('kvkkConsent', e.target.checked)} />
                <span className="text-sm text-gray-600 font-medium"><span className="font-bold text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-orange-400 transition-all">KVKK Aydınlatma Metni</span>'ni okudum ve kabul ediyorum. <span className="text-orange-500">*</span></span>
              </label>
              
              <label className="flex items-start cursor-pointer group p-3 -ml-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-3 transition-colors flex-shrink-0 ${formData.marketingConsent ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white group-hover:border-orange-400'}`}>
                  {formData.marketingConsent && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <input type="checkbox" className="hidden" checked={formData.marketingConsent} onChange={(e) => updateField('marketingConsent', e.target.checked)} />
                <span className="text-sm text-gray-600 font-medium">Tarafıma ticari elektronik ileti gönderilmesini kabul ediyorum.</span>
              </label>
            </div>
          </div>
        );

      case 2: return renderQuestion('Çocuğunuzun Eğitim Kademesi Nedir?', 'gradeLevel', OPTIONS.step2);
      // Çoklu seçime dönüştürüldü (multi=true, checkbox)
      case 3: return renderQuestion('Çocuğunuzun Hâlihazırda Devam Ettiği Okul Türü?', 'currentSchoolType', OPTIONS.step3, true);
      // Çoklu seçime dönüştürüldü (multi=true, checkbox)
      case 4: return renderQuestion('Webinara Katılma Amacınız?', 'webinarPurpose', OPTIONS.step4, true);
      case 5: return renderQuestion('Okul Seçimiyle İlgili En Acil İhtiyacınız?', 'urgentNeeds', OPTIONS.step5, true);
      case 6: return renderQuestion('Çocuğunuzu Tanıtan İfadeler?', 'childTraits', OPTIONS.step6, true);
      // Çoklu seçime dönüştürüldü (multi=true, checkbox)
      case 7: return renderQuestion('Çocuğunuz İçin Hangi Tür Okul Yaklaşımını Uygun Görüyorsunuz?', 'schoolApproach', OPTIONS.step7, true, 'grid');
      case 8: return renderQuestion('Yıllık Bütçe Aralığınız?', 'budgetRange', OPTIONS.step8, false, 'grid');
      case 9: 
        const isYoung = ['Anaokulu', 'İlkokul'].includes(formData.gradeLevel);
        const opts = isYoung ? OPTIONS.step9_young : OPTIONS.step9_old;
        return opts.length > 0 
          ? renderQuestion(`Eğitim Yaklaşımınız (${isYoung ? 'Anaokulu & İlkokul' : 'Ortaokul & Lise'})`, 'educationValues', opts, true) 
          : <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">Lütfen önce 2. adımda eğitim kademesini seçiniz.</div>;
      case 10: return renderQuestion('Webinar Sonrasında Hangi İçeriği Almak İstersiniz?', 'postWebinarContent', OPTIONS.step10, true, 'list', 'postWebinarOtherText');
      case 11: return renderQuestion('Keşke Şöyle Bir Platform Olsa Dediğiniz Özellikler?', 'platformWishlist', OPTIONS.step11, true, 'list', 'platformWishlistOtherText');
      case 12: 
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">Ebeveyn Mentoru ve Okul Seçim Uzmanı Ali Koç'tan En Çok Hangi Konuda İçerik Duymak İstersiniz?</h2>
            <div className="relative">
              <textarea 
                className="w-full p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-lg font-medium text-gray-900 resize-none min-h-[240px]"
                placeholder="Örn: Sınav kaygısı ile nasıl baş edebilirim?"
                maxLength={200}
                value={formData.mentorFeedback}
                onChange={(e) => updateField('mentorFeedback', e.target.value)}
              />
              <div className="text-right text-sm font-medium text-gray-400 mt-3">{formData.mentorFeedback.length}/200</div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 pt-24 pb-10 selection:bg-orange-100 selection:text-orange-900 font-sans">
      
      {/* Top Header Fixed - SOLID WHITE BACKGROUND */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {!logoError ? (
                <img src="/logo.png" alt="Eğitimpedia" className="h-10 w-auto object-contain" onError={() => setLogoError(true)} />
             ) : (
                <span className="font-black text-2xl text-orange-600 tracking-tighter">Eğitimpedia</span>
             )}
          </div>
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-3">
             <div className="text-sm font-bold text-gray-400">Adım {currentStep} <span className="text-gray-300">/</span> {TOTAL_STEPS}</div>
             <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
             </div>
          </div>
        </div>
        {/* Mobile Progress Line */}
        <div className="md:hidden h-1 bg-gray-100 w-full">
          <div className="h-full bg-orange-600 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <div className="w-full max-w-3xl mt-4 mb-10">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-white p-1 overflow-hidden">
          <div className="p-6 md:p-12 min-h-[400px] flex flex-col justify-center">
            {renderContent()}
          </div>
          
          {errorMsg && (
            <div id="error-message" className="px-6 md:px-12 pb-6 scroll-mt-24">
              <div className="bg-red-50 text-red-600 px-5 py-4 rounded-xl text-sm font-medium flex items-center animate-bounce shadow-sm border border-red-100">
                <AlertCircle size={20} className="mr-3" /> {errorMsg}
              </div>
            </div>
          )}

          <div className="bg-gray-50 px-6 md:px-12 py-6 border-t border-gray-100 flex justify-between items-center rounded-b-[1.8rem]">
            <button 
              type="button"
              onClick={handleBack} 
              disabled={currentStep === 1 || isSubmitting}
              className={`
                flex items-center px-6 py-3.5 rounded-xl text-base font-bold transition-all
                ${currentStep === 1 
                  ? 'text-gray-300 cursor-not-allowed opacity-0' 
                  : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-md'
                }
              `}
            >
              <ChevronLeft size={20} className="mr-1" /> Geri
            </button>

            <button 
              type="button"
              onClick={handleNext} 
              disabled={isSubmitting}
              className={`
                flex items-center px-8 py-4 rounded-xl text-base font-bold text-white shadow-xl shadow-orange-500/20 transition-all transform active:scale-95 hover:-translate-y-1
                ${isSubmitting ? 'bg-orange-300 cursor-wait' : 'bg-orange-600 hover:bg-orange-700'}
              `}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : currentStep === TOTAL_STEPS ? (
                <>Kaydı Tamamla <Check size={20} className="ml-2" /></>
              ) : (
                <>Devam Et <ArrowRight size={20} className="ml-2" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
