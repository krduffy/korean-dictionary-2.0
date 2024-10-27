from words.tests.fixtures.db_data_manager import DbDataManager


class DbDataMixin:
    """Mixin that provides test data setup functionality"""

    @classmethod
    def setUpTestData(cls):
        """Set up data for all class methods"""
        cls.test_data = DbDataManager.create_all_test_data()

        cls.regular_user = cls.test_data["regular_user"]
        cls.second_regular_user = cls.test_data["second_regular_user"]
        cls.staff = cls.test_data["staff"]
        cls.words = cls.test_data["korean_words"]
        cls.hanja = cls.test_data["hanja_characters"]
