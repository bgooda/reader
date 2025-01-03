import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint returns correct status"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

class TestTranslations:
    """Test suite for translation functionality"""
    
    def test_single_word_translation(self):
        """Test translating a single German word"""
        response = client.post(
            "/translate",
            json={"text": "ich", "language": "de"}
        )
        assert response.status_code == 200
        assert response.json() == {"translation": "I"}

    def test_unknown_single_word(self):
        """Test handling of unknown single words"""
        response = client.post(
            "/translate",
            json={"text": "unknownword", "language": "de"}
        )
        assert response.status_code == 200
        # Unknown words should be returned as-is
        assert response.json() == {"translation": "unknownword"}

    def test_exact_phrase_match(self):
        """Test translating an exact phrase match"""
        response = client.post(
            "/translate",
            json={"text": "Sehr geehrte Damen und Herren", "language": "de"}
        )
        assert response.status_code == 200
        assert response.json() == {"translation": "Dear Ladies and Gentlemen"}

    def test_compound_phrase_translation(self):
        """Test translating a phrase that needs to be broken down"""
        response = client.post(
            "/translate",
            json={"text": "ich habe", "language": "de"}
        )
        assert response.status_code == 200
        assert response.json() == {"translation": "I have"}

    def test_mixed_known_unknown_words(self):
        """Test translating a phrase with both known and unknown words"""
        response = client.post(
            "/translate",
            json={"text": "ich unknownword", "language": "de"}
        )
        assert response.status_code == 200
        assert response.json() == {"translation": "I unknownword"}

    def test_non_german_language(self):
        """Test handling of non-German language requests"""
        response = client.post(
            "/translate",
            json={"text": "hello", "language": "en"}
        )
        assert response.status_code == 200
        # Non-German text should be returned as-is
        assert response.json() == {"translation": "hello"}

    def test_empty_text(self):
        """Test handling of empty text"""
        response = client.post(
            "/translate",
            json={"text": "", "language": "de"}
        )
        assert response.status_code == 200
        assert response.json() == {"translation": ""}

    def test_whitespace_handling(self):
        """Test proper handling of whitespace"""
        response = client.post(
            "/translate",
            json={"text": "  ich  habe  ", "language": "de"}
        )
        assert response.status_code == 200
        assert response.json() == {"translation": "I have"}

    def test_long_phrase_translation(self):
        """Test translating a longer phrase"""
        response = client.post(
            "/translate",
            json={
                "text": "Ich war sehr glücklich die Hose ist nach wenigen Tagen schon angekommen",
                "language": "de"
            }
        )
        assert response.status_code == 200
        assert "I was very happy" in response.json()["translation"]

    def test_invalid_request_body(self):
        """Test handling of invalid request body"""
        response = client.post(
            "/translate",
            json={"invalid": "data"}
        )
        assert response.status_code == 422  # Validation error