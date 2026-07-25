import time
from xml.etree import ElementTree

import pytest

from app.pipeline.arxiv_fetcher import (
    MIN_REQUEST_INTERVAL_SECONDS,
    _entry_to_dict,
    _parse_atom_xml,
    _respect_rate_limit,
)

SAMPLE_ENTRY = """
<entry xmlns="http://www.w3.org/2005/Atom">
    <id>http://arxiv.org/abs/2507.12345v1</id>
    <title>Detecting Misinformation with Graph Neural Networks</title>
    <summary>We study the spread of fake news on social media.</summary>
    <published>2025-07-20T10:00:00Z</published>
    <updated>2025-07-21T10:00:00Z</updated>
    <author><name>Jane Doe</name></author>
    <author><name>John Smith</name></author>
    <category term="cs.SI" />
    <link title="pdf" href="http://arxiv.org/pdf/2507.12345v1" />
</entry>
"""

SAMPLE_FEED = f"""<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    {SAMPLE_ENTRY}
</feed>
"""


def test_entry_to_dict_extracts_fields():
    entry = ElementTree.fromstring(SAMPLE_ENTRY)
    paper = _entry_to_dict(entry)

    assert paper["arxiv_id"] == "2507.12345v1"
    assert "Misinformation" in paper["title"]
    assert paper["authors"] == ["Jane Doe", "John Smith"]
    assert paper["categories"] == ["cs.SI"]
    assert paper["pdf_url"] == "http://arxiv.org/pdf/2507.12345v1"
    assert paper["published"] == "2025-07-20T10:00:00Z"


def test_parse_atom_xml_returns_json_serializable_list():
    papers = _parse_atom_xml(SAMPLE_FEED)

    assert isinstance(papers, list)
    assert len(papers) == 1
    assert papers[0]["arxiv_id"] == "2507.12345v1"


def test_respect_rate_limit_enforces_minimum_interval(monkeypatch):
    import app.pipeline.arxiv_fetcher as fetcher_module

    monkeypatch.setattr(fetcher_module, "_last_request_at", None)
    slept_for: list[float] = []
    monkeypatch.setattr(time, "sleep", lambda seconds: slept_for.append(seconds))

    _respect_rate_limit()  # ilk çağrı: bekleme yok
    assert slept_for == []

    _respect_rate_limit()  # hemen ardından ikinci çağrı: ~3 saniye beklemeli
    assert len(slept_for) == 1
    assert slept_for[0] == pytest.approx(MIN_REQUEST_INTERVAL_SECONDS, abs=0.5)
