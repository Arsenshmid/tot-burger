import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';

/* ============ НАСТРОЙКИ ============ */
const WHATSAPP = '79679122416';          // номер для заказов WhatsApp, без + и пробелов
const PHONE_DISPLAY = '+7 967 912-24-16'; // как показываем номер на экране
const PHONE_URL = 'tel:+79679122416';     // для звонка

const PICKUP_POINTS = ['Дежнева, 13 (Залог)', '202 микрорайон (Дамба)'];

const LOCATIONS = [
  {
    name: 'Дежнева, 13 — Залог',
    address: 'г. Якутск, ул. Дежнева, 13',
    hours: ['Пн–Чт: 11:00–22:00', 'Пт–Вс: 10:00–23:00'],
    mapUrl: 'https://2gis.ru/yakutsk/firm/70000001112776381',
  },
  {
    name: '202 микрорайон — Дамба',
    address: 'г. Якутск, 202 микрорайон (дамба)',
    hours: ['Пн–Чт: 11:00–22:00', 'Пт–Вс: 10:00–23:00'],
    mapUrl: 'https://2gis.ru/yakutsk/firm/70000001115644501',
  },
];

const MENU = [
  { id: 'b1', cat: 'burgers', emoji: '🍔', name: 'ТОТ Самый', price: 590, desc: 'Булочка, говяжья котлета, салат, помидор, солёные огурцы, красный лук, соус кисло-сладкий' },
  { id: 'b2', cat: 'burgers', emoji: '🧀', name: 'ТОТ Самый сырный', price: 640, desc: 'Булочка, говяжья котлета, сыр чеддер, салат, помидор, солёные огурцы, соус кисло-сладкий' },
  { id: 'b3', cat: 'burgers', emoji: '🍯', name: 'ТОТ Самый медовый', price: 640, desc: 'Булочка, говяжья котлета, мёд, сыр чеддер, салат, помидор, солёные огурцы, бекон, соус сырный, барбекю' },
  { id: 'b4', cat: 'burgers', emoji: '🥓', name: 'ТОТ Самый фирменный', price: 690, desc: 'Булочка, говяжья котлета, сыр чеддер, салат, помидор, солёные огурцы, красный лук, бекон, соус фирменный' },
  { id: 'b5', cat: 'burgers', emoji: '🔥', name: 'ТОТ Бургер', price: 790, desc: 'Булочка, двойная котлета, двойной чеддер, салат, помидор, солёные огурцы, бекон, соус сырный, барбекю' },
  { id: 'f1', cat: 'extra', emoji: '🍟', name: 'Фри', price: 200 },
  { id: 'f2', cat: 'extra', emoji: '🥓', name: 'Фрайс с беконом', price: 350 },
  { id: 'f3', cat: 'extra', emoji: '🥣', name: 'Соус', price: 30 },
  { id: 'd1', cat: 'drinks', emoji: '🥤', name: 'Кола 0,3', price: 130 },
  { id: 'd2', cat: 'drinks', emoji: '🥤', name: 'Спрайт 0,3', price: 130 },
  { id: 'd3', cat: 'drinks', emoji: '🥤', name: 'Фанта 0,3', price: 130 },
  { id: 'd4', cat: 'drinks', emoji: '🧃', name: 'Сок 0,2', price: 100 },
  { id: 'd5', cat: 'drinks', emoji: '⚡', name: 'Энергетик', price: 180 },
  { id: 'h1', cat: 'hot', emoji: '🍵', name: 'Чай чёрный', price: 50 },
  { id: 'h2', cat: 'hot', emoji: '🍵', name: 'Чай зелёный', price: 50 },
  { id: 'h3', cat: 'hot', emoji: '🍋', name: 'Чай с лимоном', price: 60 },
  { id: 'h4', cat: 'hot', emoji: '🥛', name: 'Чай с молоком', price: 60 },
  { id: 'h5', cat: 'hot', emoji: '☕', name: 'Кофе 3 в 1', price: 60 },
];

const CATS = [
  ['burgers', '🍔 Бургеры'],
  ['extra', '🍟 Дополнительно'],
  ['drinks', '🥤 Напитки'],
  ['hot', '☕ Горячие напитки'],
];

const fmt = (n) => `${n} ₽`;

/* ============ ЗВОНКИ И КАРТЫ ============ */
const callPhone = () => {
  Linking.openURL(PHONE_URL).catch(() =>
    Alert.alert('Не удалось позвонить', 'Наберите вручную: ' + PHONE_DISPLAY)
  );
};

const openMap = (url) => {
  Linking.openURL(url).catch(() =>
    Alert.alert('Ошибка', 'Не удалось открыть карту')
  );
};

/* ============ ГЛАВНЫЙ КОМПОНЕНТ ============ */
export default function App() {
  const [screen, setScreen] = useState('menu'); // 'menu' или 'cart'
  const [cart, setCart] = useState({});

  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  const sum = Object.entries(cart).reduce((s, [id, q]) => {
    const item = MENU.find((m) => m.id === id);
    return item ? s + item.price * q : s;
  }, 0);

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) =>
    setCart((c) => {
      if (!c[id]) return c;
      const next = { ...c };
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  const clear = () => setCart({});

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      {screen === 'menu' ? (
        <MenuScreen cart={cart} count={count} onAdd={add} onOpenCart={() => setScreen('cart')} />
      ) : (
        <CartScreen
          cart={cart}
          sum={sum}
          onAdd={add}
          onDec={dec}
          onRemove={remove}
          onClear={clear}
          onBack={() => setScreen('menu')}
        />
      )}
    </SafeAreaView>
  );
}

/* ============ ЭКРАН МЕНЮ ============ */
function MenuScreen({ count, onAdd, onOpenCart }) {
  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={styles.logoMark}>ТОТ</Text> Бургер
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={callPhone}>
            <Text style={styles.headerBtnText}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={onOpenCart}>
            <Text style={styles.headerBtnText}>🛒 {count > 0 ? count : ''}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.hero}>ТОТ Бургер.{'\n'}ТОТ Самый.</Text>
        <Text style={styles.heroSub}>Сочные котлеты, свежие ингредиенты и фирменные соусы</Text>

        <View style={styles.heroBtnsRow}>
          <TouchableOpacity style={styles.callBtn} onPress={callPhone}>
            <Text style={styles.callBtnText}>📞 {PHONE_DISPLAY}</Text>
          </TouchableOpacity>
        </View>

        {CATS.map(([cat, title]) => (
          <View key={cat} style={styles.cat}>
            <Text style={styles.catTitle}>{title}</Text>
            {MENU.filter((m) => m.cat === cat).map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  {item.desc ? <Text style={styles.cardDesc}>{item.desc}</Text> : null}
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.price}>{fmt(item.price)}</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(item.id)}>
                    <Text style={styles.addBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.catTitle}>📍 Наши точки</Text>
        {LOCATIONS.map((loc) => (
          <TouchableOpacity
            key={loc.name}
            style={styles.locCard}
            activeOpacity={0.8}
            onPress={() => openMap(loc.mapUrl)}
          >
            <Text style={styles.locName}>{loc.name}</Text>
            <Text style={styles.locAddr}>{loc.address}</Text>
            {loc.hours.map((h) => (
              <Text key={h} style={styles.locHours}>{h}</Text>
            ))}
            <Text style={styles.locLink}>Открыть в 2ГИС →</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.footer}>ТОТ Бургер. ТОТ Самый. © 2025</Text>
      </ScrollView>
    </View>
  );
}

/* ============ ЭКРАН КОРЗИНЫ ============ */
function CartScreen({ cart, sum, onAdd, onDec, onRemove, onClear, onBack }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('delivery');
  const [address, setAddress] = useState('');
  const [pickupPoint, setPickupPoint] = useState(PICKUP_POINTS[0]);
  const [comment, setComment] = useState('');

  const ids = Object.keys(cart);

  const buildOrderText = () => {
    const L = [];
    L.push('🛒 НОВЫЙ ЗАКАЗ ИЗ ПРИЛОЖЕНИЯ — ТОТ БУРГЕР');
    L.push('');
    L.push('👤 ' + name.trim());
    L.push('📞 ' + phone.trim());
    if (method === 'delivery') {
      L.push('🛵 Доставка');
      L.push('📍 ' + address.trim());
    } else {
      L.push('🏠 Самовывоз: ' + pickupPoint);
    }
    if (comment.trim()) L.push('💬 ' + comment.trim());
    L.push('');
    L.push('— СОСТАВ ЗАКАЗА —');
    ids.forEach((id, i) => {
      const item = MENU.find((m) => m.id === id);
      if (item) L.push(`${i + 1}. ${item.name} × ${cart[id]} = ${fmt(item.price * cart[id])}`);
    });
    L.push('');
    L.push('💰 ИТОГО: ' + fmt(sum));
    if (method === 'delivery') L.push('🛵 Стоимость доставки: уточнит оператор');
    return L.join('\n');
  };

  const sendOrder = () => {
    if (ids.length === 0) {
      Alert.alert('Корзина пуста', 'Добавьте блюда из меню');
      return;
    }
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Заполните данные', 'Нужны имя и телефон');
      return;
    }
    if (method === 'delivery' && !address.trim()) {
      Alert.alert('Укажите адрес', 'Куда привезти заказ?');
      return;
    }
    const url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(buildOrderText());
    Linking.openURL(url)
      .then(() => onClear())
      .catch(() =>
        Alert.alert(
          'WhatsApp не найден',
          'Установите WhatsApp или позвоните нам: ' + PHONE_DISPLAY,
          [
            { text: '📞 Позвонить', onPress: callPhone },
            { text: 'Отмена', style: 'cancel' },
          ]
        )
      );
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Меню</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Корзина</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {ids.length === 0 ? (
          <>
            <Text style={styles.empty}>Корзина пуста{'\n'}Добавьте бургеров 🍔</Text>
            <TouchableOpacity style={styles.callBtn} onPress={callPhone}>
              <Text style={styles.callBtnText}>📞 Или позвоните: {PHONE_DISPLAY}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {ids.map((id) => {
              const item = MENU.find((m) => m.id === id);
              if (!item) return null;
              return (
                <View key={id} style={styles.card}>
                  <Text style={styles.cardEmoji}>{item.emoji}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardDesc}>{fmt(item.price)} / шт</Text>
                  </View>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => onDec(id)}>
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNum}>{cart[id]}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => onAdd(id)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => onRemove(id)} hitSlop={8}>
                    <Text style={styles.del}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Итого:</Text>
              <Text style={[styles.totalText, { color: ORANGE }]}>{fmt(sum)}</Text>
            </View>

            <Text style={styles.formTitle}>Данные для заказа</Text>

            <Text style={styles.label}>Ваше имя *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Иван" placeholderTextColor="#666" />

            <Text style={styles.label}>Телефон *</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+7 9xx xxx-xx-xx" keyboardType="phone-pad" placeholderTextColor="#666" />

            <View style={styles.methodRow}>
              <TouchableOpacity
                style={[styles.methodBtn, method === 'delivery' && styles.methodBtnActive]}
                onPress={() => setMethod('delivery')}
              >
                <Text style={[styles.methodText, method === 'delivery' && styles.methodTextActive]}>🛵 Доставка</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodBtn, method === 'pickup' && styles.methodBtnActive]}
                onPress={() => setMethod('pickup')}
              >
                <Text style={[styles.methodText, method === 'pickup' && styles.methodTextActive]}>🏠 Самовывоз</Text>
              </TouchableOpacity>
            </View>

            {method === 'delivery' ? (
              <>
                <Text style={styles.label}>Адрес доставки *</Text>
                <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Улица, дом, квартира" placeholderTextColor="#666" />
              </>
            ) : (
              <>
                <Text style={styles.label}>Точка самовывоза</Text>
                {PICKUP_POINTS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.pickBtn, pickupPoint === p && styles.pickBtnActive]}
                    onPress={() => setPickupPoint(p)}
                  >
                    <Text style={[styles.pickText, pickupPoint === p && styles.pickTextActive]}>
                      {pickupPoint === p ? '✓ ' : ''}{p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            <Text style={styles.label}>Комментарий</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={comment}
              onChangeText={setComment}
              placeholder="Без лука, позвонить заранее..."
              placeholderTextColor="#666"
              multiline
            />

            <TouchableOpacity style={styles.sendBtn} onPress={sendOrder}>
              <Text style={styles.sendBtnText}>Отправить заказ в WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callLinkWrap} onPress={callPhone}>
              <Text style={styles.callLink}>Или позвоните: {PHONE_DISPLAY}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
              <Text style={styles.clearBtnText}>Очистить корзину</Text>
            </TouchableOpacity>

            <Text style={styles.note}>После отправки мы перезвоним для подтверждения</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ============ СТИЛИ ============ */
const ORANGE = '#f58220';
const BG = '#0d0d0d';
const CARD = '#1a1a1a';
const BORDER = '#2a2a2a';
const TEXT = '#f5f0e8';
const MUTED = '#9b948a';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTitle: { color: TEXT, fontSize: 20, fontWeight: '900' },
  logoMark: { backgroundColor: ORANGE, color: BG, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden', fontWeight: '900' },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerBtn: { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  headerBtnText: { color: TEXT, fontSize: 16, fontWeight: '800' },
  headerSpacer: { width: 60 },
  backBtn: { color: ORANGE, fontSize: 16, fontWeight: '800', width: 60 },
  content: { padding: 16, paddingBottom: 40 },
  hero: { color: TEXT, fontSize: 32, fontWeight: '900', textAlign: 'center', marginTop: 12, textTransform: 'uppercase' },
  heroSub: { color: MUTED, textAlign: 'center', marginTop: 8, marginBottom: 16, fontSize: 14 },
  heroBtnsRow: { marginBottom: 24 },
  cat: { marginBottom: 24 },
  catTitle: { color: ORANGE, fontSize: 20, fontWeight: '900', textTransform: 'uppercase', marginBottom: 12 },
  card: { flexDirection: 'row', backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 12, marginBottom: 10, alignItems: 'center' },
  cardEmoji: { fontSize: 28, marginRight: 10 },
  cardInfo: { flex: 1 },
  cardName: { color: TEXT, fontWeight: '800', fontSize: 15 },
  cardDesc: { color: MUTED, fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  price: { backgroundColor: ORANGE, color: BG, fontWeight: '900', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 13, overflow: 'hidden' },
  addBtn: { backgroundColor: ORANGE, width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: BG, fontSize: 20, fontWeight: '900', lineHeight: 22 },
  locCard: { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 10 },
  locName: { color: ORANGE, fontWeight: '900', fontSize: 16, textTransform: 'uppercase' },
  locAddr: { color: TEXT, fontSize: 14, marginTop: 4 },
  locHours: { color: MUTED, fontSize: 13, marginTop: 2 },
  locLink: { color: ORANGE, fontSize: 13, fontWeight: '800', marginTop: 8 },
  callBtn: { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  callBtnText: { color: BG, fontWeight: '900', fontSize: 15 },
  empty: { color: MUTED, textAlign: 'center', fontSize: 18, marginTop: 60, lineHeight: 30, marginBottom: 24 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: TEXT, fontSize: 18, fontWeight: '800' },
  qtyNum: { color: TEXT, fontSize: 16, fontWeight: '800', minWidth: 18, textAlign: 'center' },
  del: { color: MUTED, fontSize: 16, marginLeft: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 20 },
  totalText: { color: TEXT, fontSize: 22, fontWeight: '900' },
  formTitle: { color: ORANGE, fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginBottom: 12 },
  label: { color: MUTED, fontSize: 13, marginBottom: 4 },
  input: { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 10, color: TEXT, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 12 },
  textarea: { height: 70, textAlignVertical: 'top' },
  methodRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  methodBtn: { flex: 1, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  methodBtnActive: { borderColor: ORANGE, backgroundColor: '#2a1f10' },
  methodText: { color: MUTED, fontWeight: '800' },
  methodTextActive: { color: ORANGE },
  pickBtn: { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 8 },
  pickBtnActive: { borderColor: ORANGE, backgroundColor: '#2a1f10' },
  pickText: { color: MUTED, fontWeight: '700' },
  pickTextActive: { color: ORANGE },
  sendBtn: { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  sendBtnText: { color: BG, fontWeight: '900', fontSize: 16 },
  callLinkWrap: { alignItems: 'center', paddingVertical: 12 },
  callLink: { color: ORANGE, fontWeight: '800', fontSize: 15, textDecorationLine: 'underline' },
  clearBtn: { alignItems: 'center', paddingVertical: 4 },
  clearBtnText: { color: MUTED, fontSize: 14 },
  note: { color: MUTED, fontSize: 12, textAlign: 'center', marginTop: 8 },
  footer: { color: MUTED, textAlign: 'center', marginTop: 10, fontSize: 12 },
});