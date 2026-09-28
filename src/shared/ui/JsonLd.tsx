type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // \u003c: متنی مثل «</script>» در داده (مثلاً آدرس از تنظیمات) نتواند از تگ بیرون بزند
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
