from cube import config 

USER_SECURITY_MAPPINGS = {
    # YOUR USER - UPDATE WITH YOUR WORKSHOP EMAIL
    "wdc-2025-999@example.com": {
        "role": "global_admin",
        "filter_type": "none",
        "show_pii": "true"  # Admins can see PII data
    },
    
    # Global admin - sees everything
    "admin@tpch.com": {
        "role": "global_admin",
        "filter_type": "none",
        "show_pii": "true"  # Admins can see PII data
    },

    # Regional director - North America (Region 1)
    "director_na@tpch.com": {
        "role": "regional_director", 
        "filter_type": "region",
        "region_key": 1  # AMERICA
    },
    
    # Regional director - Europe (Region 3)
    "director_eu@tpch.com": {
        "role": "regional_director",
        "filter_type": "region", 
        "region_key": 3  # EUROPE
    },
    
    # Sales rep - specific customers
    "sarah_jones@tpch.com": {
        "role": "sales_rep",
        "filter_type": "customers",
        "customer_keys": [1, 7, 13, 19, 25]  # 5 customers
    },
    
    # Sales rep - different customers
    "mike_chen@tpch.com": {
        "role": "sales_rep",
        "filter_type": "customers",
        "customer_keys": [2, 8, 14, 20, 26, 27, 28]  # 7 customers
    }
}

@config('query_rewrite')
def query_rewrite(query: dict, ctx: dict) -> dict:
    # Get user from security context
    user_id = ctx.get('securityContext', {}).get('user_id')
    
    # Look up user's security settings
    user_security = USER_SECURITY_MAPPINGS.get(user_id, {})
    
    # Default to no access if user not found
    if not user_security:
        # Add impossible filter to return no data
        query['filters'].append({
            'member': 'customers.customer_key',
            'operator': 'equals',
            'values': ['-1']  # Non-existent customer
        })
        return query
    
    # Apply filters based on user type
    filter_type = user_security.get('filter_type')
    
    if filter_type == 'none':
        # Global admin - no filters needed
        pass
        
    elif filter_type == 'region':
        # Regional director - filter by region
        query['filters'].append({
            'member': 'customer_regions.region_key',
            'operator': 'equals',
            'values': [str(user_security['region_key'])]
        })
        
    elif filter_type == 'customers':
        # Sales rep - filter by customer list
        query['filters'].append({
            'member': 'customers.customer_key',
            'operator': 'in',
            'values': [str(ck) for ck in user_security['customer_keys']]
        })
    
    return query

@config('extend_context')
def extend_context(req: dict) -> dict:
    # Check if securityContext exists, skip extending context if not
    if 'securityContext' not in req:
        return req

    # Get user from security context 
    security_context = req.get('securityContext', {})
    
    # If user_id is not in the securityContext, extract it from cubeCloud.username
    if 'user_id' not in security_context:
        if 'cubeCloud' in security_context:
            # Update the user_id in the security context
            req['securityContext']['user_id'] = security_context.get('cubeCloud', {}).get('username')
    
    user_id = security_context.get('user_id', 'anonymous')
    
    # Look up user security settings
    user_security = USER_SECURITY_MAPPINGS.get(user_id, {})
    
    # Set the show_pii flag in security context for template function
    req['securityContext']['show_pii'] = user_security.get('show_pii', 'false')
    req['securityContext']['role'] = user_security.get('role', 'viewer')  # Add role

    return req

@config('context_to_app_id')
def context_to_app_id(ctx: dict) -> str:
    security_context = ctx.get('securityContext', {})
    show_pii = security_context.get('show_pii', 'false')
    role = security_context.get('role', 'viewer')
    
    # Create a cache key that includes both role and PII access
    # This ensures users with different roles get separate cached data models
    return f"CUBE_APP_{role}_{show_pii}"