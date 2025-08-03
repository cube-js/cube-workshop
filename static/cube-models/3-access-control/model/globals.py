from cube import TemplateContext
 
template = TemplateContext()
 
@template.function('masked')
def masked(sql, security_context):
  
  # Check if security_context is None or empty
  if not security_context:
    return "'--- masked ---'"
  
  # Safely get the show_pii value
  show_pii = security_context.get('show_pii', 'false')
  
  # Use explicit string comparison and handle case sensitivity
  if show_pii.lower() == 'true':
    return sql
  else:
    return "'--- masked ---'"