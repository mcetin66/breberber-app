# Multi-tenant Database Patterns

## 1. Tenant İzolasyonu

```sql
-- Tablo yapısı
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  customer_id UUID NOT NULL,
  staff_id UUID NOT NULL,
  service_id UUID NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS aktif
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Tenant izolasyonu
CREATE POLICY "Tenant isolation" ON bookings
  FOR ALL
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

---

## 2. Role-based Access

```sql
-- Staff sadece kendi randevularını görür
CREATE POLICY "Staff sees own bookings" ON bookings
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    AND (
      auth.jwt() ->> 'role' IN ('owner', 'manager')
      OR staff_id = auth.uid()
    )
  );

-- Sadece manager+ silebilir
CREATE POLICY "Manager can delete" ON bookings
  FOR DELETE
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    AND auth.jwt() ->> 'role' IN ('owner', 'manager')
  );
```

---

## 3. Shared vs Tenant Data

```sql
-- SHARED: Herkes okuyabilir
CREATE TABLE service_categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT
  -- tenant_id YOK
);

CREATE POLICY "Public read" ON service_categories
  FOR SELECT USING (true);

-- TENANT-SPECIFIC: Sadece kendi tenant'ı
CREATE TABLE services (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  category_id UUID REFERENCES service_categories(id),
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  duration_minutes INTEGER NOT NULL
);

CREATE POLICY "Tenant isolation" ON services
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

---

## 4. Soft Delete

```sql
-- Tablo yapısı
ALTER TABLE bookings ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- RLS'de deleted filtresi
CREATE POLICY "Hide deleted" ON bookings
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    AND deleted_at IS NULL
  );

-- Soft delete fonksiyonu
CREATE FUNCTION soft_delete_booking(booking_id UUID)
RETURNS void AS $$
  UPDATE bookings SET deleted_at = now() WHERE id = booking_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

---

## 5. Audit Trail

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger
CREATE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (tenant_id, user_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    COALESCE(NEW.tenant_id, OLD.tenant_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER bookings_audit
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION log_audit();
```

---

## 6. Tenant Provisioning

```sql
CREATE FUNCTION provision_tenant()
RETURNS TRIGGER AS $$
BEGIN
  -- Default ayarlar
  INSERT INTO tenant_settings (tenant_id, key, value)
  VALUES 
    (NEW.id, 'timezone', 'Europe/Istanbul'),
    (NEW.id, 'currency', 'TRY'),
    (NEW.id, 'language', 'tr'),
    (NEW.id, 'slot_duration', '10');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_tenant_created
  AFTER INSERT ON tenants
  FOR EACH ROW EXECUTE FUNCTION provision_tenant();
```

---

## 7. Kontrol Listesi

- [ ] Tenant-owned tablolarda `tenant_id` var
- [ ] RLS her tabloda aktif
- [ ] Role-based policy'ler tanımlı
- [ ] Shared vs tenant-specific ayrımı yapılmış
- [ ] Soft delete uygulanmış
- [ ] Audit trail kritik tablolarda var
- [ ] Tenant provisioning otomatik
