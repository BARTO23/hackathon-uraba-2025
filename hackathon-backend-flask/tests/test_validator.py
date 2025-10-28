import unittest
import pandas as pd
from app.core.validator import validate_data, transform_for_sioma


class TestValidator(unittest.TestCase):
    
    def test_validate_empty_dataframe(self):
        """Probar validación con DataFrame vacío"""
        df = pd.DataFrame()
        result = validate_data(df)
        self.assertFalse(result['valid'])
        self.assertIn('El archivo está vacío', result['errors'])
    
    def test_validate_valid_dataframe(self):
        """Probar validación con DataFrame válido"""
        df = pd.DataFrame({
            'columna1': [1, 2, 3],
            'columna2': ['a', 'b', 'c']
        })
        result = validate_data(df)
        # TODO: Actualizar según las validaciones reales
        self.assertTrue(result['valid'])
    
    def test_transform_for_sioma(self):
        """Probar transformación de datos para Sioma"""
        data = {'test': 'value'}
        result = transform_for_sioma(data)
        self.assertIn('data', result)
        self.assertEqual(result['data'], data)


if __name__ == '__main__':
    unittest.main()
