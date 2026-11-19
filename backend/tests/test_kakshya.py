import pytest
from app.bsp.kakshya import KAKSHYA_LORDS, calculate_kakshya, same_degree_number

@pytest.mark.parametrize(
    ("degree", "expected"),
    [
        (0, "Saturn"),
        (3.749999, "Saturn"),
        (3.75, "Jupiter"),
        (7.5, "Mars"),
        (11.25, "Sun"),
        (15.0, "Venus"),
        (18.75, "Mercury"),
        (22.5, "Moon"),
        (26.25, "Ascendant"),
        (29.999999, "Ascendant"),
    ],
)
def test_kakshya_boundaries(degree, expected):
    assert calculate_kakshya(degree)["lord"] == expected

def test_kakshya_has_eight_equal_slots():
    assert len(KAKSHYA_LORDS) == 8
    assert calculate_kakshya(15)["start_degree"] == 15
    assert calculate_kakshya(15)["end_degree"] == 18.75

@pytest.mark.parametrize("degree", [-0.0001, 30, 30.1, float("nan"), float("inf")])
def test_kakshya_rejects_out_of_range_degrees(degree):
    with pytest.raises(ValueError):
        calculate_kakshya(degree)

def test_kakshya_rejects_non_numeric_input():
    with pytest.raises(TypeError):
        calculate_kakshya("15")

def test_same_degree_number_matches_bsp7_worked_example():
    # BSP-7 chart 2: Mars 27°14′ and Venus 27°50′.
    assert same_degree_number(27 + 14 / 60, 27 + 50 / 60)

def test_same_degree_number_does_not_match_across_degree_boundary():
    assert not same_degree_number(26 + 59 / 60, 27)

def test_same_degree_number_rejects_invalid_values():
    with pytest.raises(ValueError):
        same_degree_number(30, 0)
