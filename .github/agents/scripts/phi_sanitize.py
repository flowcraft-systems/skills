#!/usr/bin/env python3
"""phi_sanitize.py — Redact PII/PHI from EDI (X12) and DPT files before LLM analysis.
Usage: python3 phi_sanitize.py <input_file> <output_file>
"""
import re, sys, hashlib

def token(label: str, value: str) -> str:
    """Produce a short deterministic token so the same raw value maps to the same token
    within a session, preserving structural cross-references without exposing the real value."""
    h = hashlib.md5(value.encode()).hexdigest()[:6].upper()
    return f"[{label}_{h}]"

def sanitize(text: str) -> str:
    # --- X12 EDI segment-level redactions ---
    # ISA sender/receiver IDs (positions 5 and 7, colon-delimited in ISA segment)
    text = re.sub(
        r'(ISA\*[^*]*\*[^*]*\*[^*]*\*[^*]*\*)([^*]{2,15})(\*[^*]*\*)([^*]{2,15})(\*)',
        lambda m: m.group(1) + token("ISA_SENDER", m.group(2)) + m.group(3) + token("ISA_RECEIVER", m.group(4)) + m.group(5),
        text
    )
    # NM1 segments — patient/subscriber/provider names (element 3=last, 4=first, 9=ID)
    text = re.sub(
        r'(NM1\*[^*]*\*[^*]*\*)([^*]+)(\*)([^*]*)(\*[^*]*\*[^*]*\*[^*]*\*)([^*~\n]*)',
        lambda m: m.group(1) + token("NAME_LAST", m.group(2)) + m.group(3) + (token("NAME_FIRST", m.group(4)) if m.group(4) else '') + m.group(5) + token("ID", m.group(6)),
        text
    )
    # DMG segment — date of birth + gender
    text = re.sub(
        r'(DMG\*D8\*)(\d{8})',
        lambda m: m.group(1) + token("DOB", m.group(2)),
        text
    )
    # REF segments — subscriber/member/policy IDs
    text = re.sub(
        r'(REF\*[A-Z0-9]{2}\*)([^\*~\n]+)',
        lambda m: m.group(1) + token("REF_ID", m.group(2)),
        text
    )
    # N3/N4 address lines
    text = re.sub(r'(N3\*)([^~\n]+)', lambda m: m.group(1) + token("ADDR", m.group(2)), text)
    text = re.sub(r'(N4\*)([^~\n]+)', lambda m: m.group(1) + token("CITY_STATE_ZIP", m.group(2)), text)
    # PER segment — contact name + phone
    text = re.sub(r'(PER\*[^*]*\*)([^*]+)', lambda m: m.group(1) + token("CONTACT", m.group(2)), text)
    text = re.sub(r'(PER\*[^~\n]*\*TE\*)([^\*~\n]+)', lambda m: m.group(1) + token("PHONE", m.group(2)), text)

    # --- Generic pattern fallbacks (catch-all for DPT and non-standard EDI) ---
    # SSN  (9 digits, optionally dashed)
    text = re.sub(r'\b(\d{3}-\d{2}-\d{4}|\d{9})\b', lambda m: token("SSN", m.group()), text)
    # NPI (10-digit all-numeric provider ID)
    text = re.sub(r'\b(\d{10})\b', lambda m: token("NPI", m.group()), text)
    # US phone numbers
    text = re.sub(r'\b(\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4})\b', lambda m: token("PHONE", m.group()), text)
    # Dates  MM/DD/YYYY  or  YYYY-MM-DD
    text = re.sub(r'\b(\d{1,2}/\d{1,2}/\d{4}|\d{4}-\d{2}-\d{2})\b', lambda m: token("DATE", m.group()), text)
    # Email addresses
    text = re.sub(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', lambda m: token("EMAIL", m.group()), text)
    # ZIP codes (standalone 5- or 9-digit)
    text = re.sub(r'\b(\d{5}(?:-\d{4})?)\b', lambda m: token("ZIP", m.group()), text)

    return text

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: phi_sanitize.py <input> <output>", file=sys.stderr)
        sys.exit(1)
    with open(sys.argv[1], "r", errors="replace") as f:
        raw = f.read()
    sanitized = sanitize(raw)
    with open(sys.argv[2], "w") as f:
        f.write(sanitized)
    print(f"Sanitized → {sys.argv[2]}")
