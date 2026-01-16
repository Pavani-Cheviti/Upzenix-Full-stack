export const categories = {
  electronics: {
    name: 'Electronics',
    subcategories: {
      mobiles: { name: 'Mobiles', styles: [] },
      laptops: { name: 'Laptops', styles: [] },
      headphones: { name: 'Headphones', styles: [] },
      accessories: { name: 'Accessories', styles: [] }
    }
  },
  jewellery: {
    name: 'Jewellery',
    subcategories: {
      rings: { name: 'Rings', styles: [] },
      necklaces: { name: 'Necklaces', styles: [] },
      earrings: { name: 'Earrings', styles: [] },
      bracelets: { name: 'Bracelets', styles: [] }
    }
  },
  clothing: {
    name: 'Clothing',
    subcategories: {
      men: {
        name: 'Men',
        styles: ['Casual', 'Formal', 'Ethnic', 'Sportswear']
      },
      women: {
        name: 'Women',
        styles: ['Western', 'Traditional', 'Party Wear']
      }
    }
  }
};

export const getAllCategories = () => {
  return Object.keys(categories);
};

export const getCategoryDisplayName = (categoryKey) => {
  return categories[categoryKey]?.name || categoryKey;
};

export const getSubcategories = (categoryKey) => {
  return categories[categoryKey]?.subcategories || {};
};

export const getStyles = (categoryKey, subcategoryKey) => {
  return categories[categoryKey]?.subcategories[subcategoryKey]?.styles || [];
};